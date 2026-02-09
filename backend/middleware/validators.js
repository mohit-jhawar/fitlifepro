const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

// Registration validation
const validateRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('gender')
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),

    body('dateOfBirth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Please provide a valid date of birth'),

    handleValidationErrors
];

// Login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('gender')
        .optional()
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),

    body('dateOfBirth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Please provide a valid date of birth'),

    handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),

    handleValidationErrors
];

// Email validation
const validateEmail = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),

    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
    validatePasswordChange,
    validateEmail,
    validatePasswordReset
};
