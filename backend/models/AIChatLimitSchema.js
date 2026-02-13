const mongoose = require('mongoose');

const aiChatLimitSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
        index: true
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Compound index for unique user usage per day
aiChatLimitSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AIChatLimit', aiChatLimitSchema);
