const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../utils/emailService');
const { check, validationResult } = require('express-validator');

/**
 * @route   POST api/feedback
 * @desc    Submit user feedback
 * @access  Public
 */
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('message', 'Message is required').not().isEmpty()
    ],
    async (req, res) => {
        console.log('📨 Feedback request received');
        console.log('Request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', JSON.stringify(errors.array(), null, 2));
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }


        const { name, email, message } = req.body;
        console.log('Received feedback submission:', { name, email, message });


        try {
            await sendFeedbackEmail(name, email, message);
            res.json({ success: true, message: 'Feedback sent successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
