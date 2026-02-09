const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
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
    meal_date: {
        type: Date,
        required: true
    },
    meal_type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', null],
        default: null
    },
    items: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    total_calories: {
        type: Number,
        default: null
    },
    macros: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Index for user queries
mealLogSchema.index({ user_id: 1, meal_date: -1 });

module.exports = mongoose.model('MealLog', mealLogSchema);
