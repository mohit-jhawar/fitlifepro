const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found. Authorization denied.'
                });
            }

            // Attach user to request
            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                isPremium: user.is_premium
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired. Please refresh your token.',
                    code: 'TOKEN_EXPIRED'
                });
            }

            return res.status(401).json({
                success: false,
                message: 'Invalid token. Authorization denied.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isPremium: user.is_premium
                };
            }
        } catch (error) {
            // Silently fail for optional auth
        }

        next();
    } catch (error) {
        next();
    }
};

// Premium user check
const requirePremium = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (!req.user.isPremium) {
        return res.status(403).json({
            success: false,
            message: 'Premium subscription required for this feature'
        });
    }

    next();
};

module.exports = { auth, optionalAuth, requirePremium };
