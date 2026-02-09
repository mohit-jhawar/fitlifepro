const mongoose = require('mongoose');

const userMetricSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weight: {
        type: Number,
        default: null
    },
    height: {
        type: Number,
        default: null
    },
    bmi: {
        type: Number,
        default: null
    },
    body_fat_percentage: {
        type: Number,
        default: null
    },
    muscle_mass: {
        type: Number,
        default: null
    },
    recorded_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Index for user queries
userMetricSchema.index({ user_id: 1, recorded_at: -1 });

module.exports = mongoose.model('UserMetric', userMetricSchema);
