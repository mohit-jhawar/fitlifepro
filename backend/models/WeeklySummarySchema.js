const mongoose = require('mongoose');

const weeklySummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekStartDate: {
        type: Date,
        required: true
    },
    weekEndDate: {
        type: Date,
        required: true
    },
    workoutConsistency: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    macroCompliance: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    strengthImprovement: {
        type: Number,
        default: 0
    },
    areasToImprove: [{ type: String }],
    aiInsight: {
        type: String,
        default: ''
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    viewed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// One summary per user per week — prevents duplicate generation
weeklySummarySchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });
weeklySummarySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('WeeklySummary', weeklySummarySchema);
