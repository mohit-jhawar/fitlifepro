const WeeklySummary = require('../models/WeeklySummarySchema');
const WeeklySummaryService = require('../services/weeklySummaryService');

/**
 * GET /api/weekly-summary/latest
 * Generate (if needed) and return the last completed week's summary.
 * Returns null summary if the user has no data at all.
 */
exports.getLatest = async (req, res) => {
    try {
        const userId = req.user.id;
        const summary = await WeeklySummaryService.generateForLastWeek(userId);

        res.json({ success: true, summary: summary || null });
    } catch (err) {
        console.error('weeklySummary.getLatest Error:', err);
        res.status(500).json({ success: false, message: 'Server error generating weekly summary' });
    }
};

/**
 * GET /api/weekly-summary/history
 * Return all summaries for the user, newest first.
 */
exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const summaries = await WeeklySummary.find({ userId })
            .sort({ weekStartDate: -1 })
            .lean();

        res.json({ success: true, summaries });
    } catch (err) {
        console.error('weeklySummary.getHistory Error:', err);
        res.status(500).json({ success: false, message: 'Server error fetching summary history' });
    }
};

/**
 * PATCH /api/weekly-summary/:id/viewed
 * Mark a specific summary as viewed.
 */
exports.markViewed = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const summary = await WeeklySummary.findOneAndUpdate(
            { _id: id, userId },
            { $set: { viewed: true } },
            { new: true }
        );

        if (!summary) {
            return res.status(404).json({ success: false, message: 'Summary not found' });
        }

        res.json({ success: true, summary });
    } catch (err) {
        console.error('weeklySummary.markViewed Error:', err);
        res.status(500).json({ success: false, message: 'Server error updating summary' });
    }
};
