const express = require('express');
const router = express.Router();
const weeklySummaryController = require('../controllers/weeklySummaryController');
const { auth } = require('../middleware/auth');

// GET /api/weekly-summary/latest — generate + return latest summary
router.get('/latest', auth, weeklySummaryController.getLatest);

// GET /api/weekly-summary/history — all past summaries sorted by week
router.get('/history', auth, weeklySummaryController.getHistory);

// PATCH /api/weekly-summary/:id/viewed — mark as viewed
router.patch('/:id/viewed', auth, weeklySummaryController.markViewed);

module.exports = router;
