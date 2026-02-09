const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
    validatePasswordChange,
    validateEmail,
    validatePasswordReset
} = require('../middleware/validators');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshAccessToken);
router.post('/forgot-password', validateEmail, authController.forgotPassword);
router.post('/reset-password', validatePasswordReset, authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);


// Protected routes (require authentication)
router.use(auth); // All routes below require authentication

router.get('/me', authController.getMe);
router.put('/profile', validateProfileUpdate, authController.updateProfile);
router.put('/change-password', validatePasswordChange, authController.changePassword);
router.post('/logout', authController.logout);
router.delete('/account', authController.deleteAccount);

module.exports = router;
