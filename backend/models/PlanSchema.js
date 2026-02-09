const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan_type: {
        type: String,
        required: true,
        enum: ['workout', 'nutrition', 'diet', 'hybrid']
    },
    plan_name: {
        type: String,
        default: null
    },
    plan_data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    preferences: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    reminders: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for user queries
planSchema.index({ user_id: 1, is_active: 1 });

module.exports = mongoose.model('Plan', planSchema);
