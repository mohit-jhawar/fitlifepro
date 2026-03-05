const mongoose = require('mongoose');

const customFoodSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        default: null,
        trim: true
    },
    // Nutrition per 100g (or per serving if serving_size is set)
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    // Default quantity for logging
    default_quantity: { type: Number, default: 100 }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound index: fast lookup for a user's foods by name
customFoodSchema.index({ user_id: 1, name: 1 });

module.exports = mongoose.model('CustomFood', customFoodSchema);
