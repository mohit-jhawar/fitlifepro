const OTP = require('../models/OTP');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

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

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Validate OTP format
        if (otp.length !== 6 || !/^\d+$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP format. OTP must be 6 digits.'
            });
        }

        // Verify OTP using the model method
        const otpRecord = await OTP.verifyOTP(email.toLowerCase(), otp);

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP. Please request a new one.'
            });
        }

        // Check for pending registration first (new system)
        const PendingRegistration = require('../models/PendingRegistration');
        const pendingReg = await PendingRegistration.findByEmail(email);

        if (pendingReg) {
            // NEW FLOW: Create user from pending registration
            const crypto = require('crypto');
            const UserModel = require('../models/UserSchema');

            // Create user directly in database with pre-hashed password
            const user = await UserModel.create({
                email: pendingReg.email,
                password_hash: pendingReg.password_hash, // Already hashed
                name: pendingReg.name,
                gender: pendingReg.gender,
                date_of_birth: pendingReg.date_of_birth,
                is_email_verified: true, // Mark as verified immediately
                email_verification_token: null // No token needed
            });

            // Delete pending registration
            await PendingRegistration.delete(email);
            console.log('✅ User created from pending registration:', email);

            // Generate tokens for the verified user
            const { accessToken, refreshToken } = generateTokens(user._id);

            // Save refresh token
            const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await RefreshToken.create(user._id, refreshToken, refreshExpires);

            // Send welcome email (non-blocking)
            const { sendWelcomeEmail } = require('../utils/emailService');
            sendWelcomeEmail(email, user.name).catch(err =>
                console.error('Failed to send welcome email:', err)
            );

            return res.json({
                success: true,
                message: 'Email verified successfully! Welcome to FitLife Pro!',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        gender: user.gender,
                        isEmailVerified: true
                    },
                    accessToken,
                    refreshToken
                }
            });
        }

        // OLD FLOW: Handle existing unverified users (backward compatibility)
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found. Please register again.'
            });
        }

        // Mark user as verified
        await User.verifyEmail(user.email_verification_token);

        // Generate tokens for the verified user
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Save refresh token
        const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await RefreshToken.create(user.id, refreshToken, refreshExpires);

        // Send welcome email (non-blocking)
        const { sendWelcomeEmail } = require('../utils/emailService');
        sendWelcomeEmail(email, user.name).catch(err =>
            console.error('Failed to send welcome email:', err)
        );

        res.json({
            success: true,
            message: 'Email verified successfully! Welcome to FitLife Pro!',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    gender: user.gender,
                    isEmailVerified: true
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP. Please try again.'
        });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Check pending registrations first (new system)
        const PendingRegistration = require('../models/PendingRegistration');
        const pendingReg = await PendingRegistration.findByEmail(normalizedEmail);

        let userName;

        if (pendingReg) {
            // NEW FLOW: Pending registration exists
            userName = pendingReg.name;
        } else {
            // OLD FLOW: Check existing users (backward compatibility)
            const user = await User.findByEmail(normalizedEmail);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Registration not found. Please register first.'
                });
            }

            // Check if user is already verified
            if (user.is_email_verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already verified. Please login.'
                });
            }

            userName = user.name;
        }

        // Check cooldown period (60 seconds)
        const canResend = await OTP.canResend(normalizedEmail, 60);
        if (!canResend) {
            return res.status(429).json({
                success: false,
                message: 'Please wait 60 seconds before requesting a new OTP.'
            });
        }

        // Generate new OTP
        const newOTP = generateOTP();

        // Store OTP in database (5 minutes expiry)
        await OTP.createOTP(normalizedEmail, newOTP, 5);

        // Send OTP via email
        await sendOTPEmail(normalizedEmail, userName, newOTP);

        console.log('📧 OTP resent to:', normalizedEmail, '| OTP:', newOTP);

        res.json({
            success: true,
            message: 'OTP has been resent to your email.',
            data: {
                email: normalizedEmail
            }
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP. Please try again.'
        });
    }
};

module.exports = {
    verifyOTP,
    resendOTP
};
