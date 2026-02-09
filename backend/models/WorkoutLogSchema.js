const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        default: null
    },
    workout_date: {
        type: Date,
        required: true
    },
    exercises: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    duration_minutes: {
        type: Number,
        default: null
    },
    calories_burned: {
        type: Number,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Index for user queries
workoutLogSchema.index({ user_id: 1, workout_date: -1 });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
