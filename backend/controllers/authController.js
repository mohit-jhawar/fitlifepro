const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

// Generate JWT tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );

    return { accessToken, refreshToken };
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { email, password, name, gender, dateOfBirth } = req.body;

        // Check if user already exists and is verified
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.is_email_verified) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists. Please login.'
            });
        }

        // If user exists but not verified, delete the old unverified user
        // (This handles backward compatibility with old system)
        if (existingUser && !existingUser.is_email_verified) {
            await User.deleteAccount(existingUser.id);
            console.log('🗑️ Deleted old unverified user:', email);
        }

        // Store registration data in pending_registrations (not in users table yet)
        const PendingRegistration = require('../models/PendingRegistration');
        await PendingRegistration.create(email, password, name, gender, dateOfBirth);
        console.log('📝 Created pending registration for:', email);

        // Generate OTP
        const OTP = require('../models/OTP');
        const { generateOTP, sendOTPEmail } = require('../utils/emailService');

        const otp = generateOTP();

        // Store OTP in database (5 minutes expiry)
        await OTP.createOTP(email.toLowerCase(), otp, 5);

        // Send OTP via email
        try {
            await sendOTPEmail(email, name, otp);
            console.log('📧 OTP sent to:', email, '| OTP:', otp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            // If email fails, clean up pending registration
            await PendingRegistration.delete(email);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try again or contact support.'
            });
        }

        // Don't create user yet - only after OTP verification
        res.status(201).json({
            success: true,
            message: 'Registration initiated! Please check your email for the verification code.',
            data: {
                email: email.toLowerCase(),
                name: name,
                requiresVerification: true
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await User.verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if email is verified
        if (!user.is_email_verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email address before logging in.',
                data: {
                    email: user.email,
                    name: user.name,
                    requiresVerification: true
                }
            });
        }

        // Update last login
        await User.updateLastLogin(user.id);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Save refresh token
        const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await RefreshToken.create(user.id, refreshToken, refreshExpires);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    gender: user.gender,
                    isEmailVerified: user.is_email_verified,
                    isPremium: user.is_premium
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ success: false, message: 'Google credential is required' });
        }

        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Use our User model method to find or create the Google User
        const user = await User.googleLogin({ email, name, picture, googleId });

        // Update last login
        await User.updateLastLogin(user.id);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Save refresh token
        const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await RefreshToken.create(user.id, refreshToken, refreshExpires);

        res.json({
            success: true,
            message: 'Google Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    gender: user.gender,
                    isEmailVerified: user.is_email_verified,
                    isPremium: user.is_premium
                },
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during Google login',
            error: error.message
        });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if token exists in database
        const tokenRecord = await RefreshToken.findByToken(refreshToken);
        if (!tokenRecord) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            data: { accessToken }
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await RefreshToken.deleteByToken(refreshToken);
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            gender: req.body.gender,
            date_of_birth: req.body.dateOfBirth,
            profile_picture_url: req.body.profilePictureUrl,
            target_weight: req.body.targetWeight,
            units: req.body.units
        };

        // Update core profile
        await User.updateProfile(req.user.id, updates);

        // Update metrics if provided
        if (req.body.weight || req.body.height) {
            await User.logMetrics(req.user.id, {
                weight: req.body.weight,
                height: req.body.height,
                bmi: req.body.bmi,
                bodyFat: req.body.bodyFat,
                muscleMass: req.body.muscleMass
            });
        }

        // Return full updated profile
        const updatedUser = await User.findById(req.user.id);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating profile'
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        await User.changePassword(req.user.id, currentPassword, newPassword);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error changing password'
        });
    }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset code has been sent.'
            });
        }

        // Prevent Google-only users from resetting password
        if (user.auth_provider === 'google' && !user.password_hash) {
            return res.status(400).json({
                success: false,
                message: 'This account was created with Google. Please "Sign in with Google".'
            });
        }

        const OTP = require('../models/OTP');
        const { generateOTP, sendPasswordResetOTPEmail } = require('../utils/emailService');

        const otp = generateOTP();

        // Store OTP in database (10 minutes expiry)
        await OTP.createOTP(email.toLowerCase(), otp, 10);

        try {
            await sendPasswordResetOTPEmail(email, user.name, otp);
            console.log('📧 Password Reset OTP sent to:', email, '| OTP:', otp);
        } catch (emailError) {
            console.error('Failed to send Password Reset OTP email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send reset code. Please try again later.'
            });
        }

        res.json({
            success: true,
            message: 'A 6-digit password reset code has been sent to your email.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset request'
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const OTP = require('../models/OTP');
        const otpRecord = await OTP.verifyOTP(email.toLowerCase(), otp);

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code.'
            });
        }

        await User.changePasswordAfterReset(email.toLowerCase(), newPassword);

        res.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error occurred while resetting password.'
        });
    }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.verifyEmail(token);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        res.json({
            success: true,
            message: 'Email verified successfully',
            data: { user }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying email'
        });
    }
};

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const deleted = await User.deleteAccount(req.user.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account'
        });
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    refreshAccessToken,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    deleteAccount,
    ...require('./otpController') // verifyOTP and resendOTP
};
