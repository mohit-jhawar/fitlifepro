const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    brand: { type: String, default: null },
    quantity: { type: Number, required: true },   // in grams
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 }
}, { _id: true });

const mealLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    log_date: {
        type: String,      // stored as 'YYYY-MM-DD' string for easy querying
        required: true,
        index: true
    },
    calorie_goal: { type: Number, default: 2000 },
    protein_goal: { type: Number, default: 150 },
    carbs_goal: { type: Number, default: 250 },
    fat_goal: { type: Number, default: 65 },
    water_glasses: { type: Number, default: 0 },
    water_goal: { type: Number, default: 8 },
    breakfast: [foodItemSchema],
    lunch: [foodItemSchema],
    dinner: [foodItemSchema],
    snacks: [foodItemSchema]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound unique index: one log per user per day
mealLogSchema.index({ user_id: 1, log_date: 1 }, { unique: true });

module.exports = mongoose.model('MealLog', mealLogSchema);
