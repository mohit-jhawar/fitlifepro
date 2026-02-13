const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

// @route   POST api/ai/chat
// @desc    Chat with AI Coach
// @access  Private
router.post('/chat', auth, aiController.chat);

module.exports = router;
