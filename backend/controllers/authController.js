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
            profile_picture_url: req.body.profilePictureUrl
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

        const result = await User.createPasswordResetToken(email);

        if (!result) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // TODO: Send password reset email with resetToken
        console.log('Password reset token:', result.resetToken);

        res.json({
            success: true,
            message: 'Password reset link has been sent to your email'
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
        const { token, newPassword } = req.body;

        await User.resetPassword(token, newPassword);

        res.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Invalid or expired reset token'
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
