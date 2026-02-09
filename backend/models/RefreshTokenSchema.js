const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires_at: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Index for user and token queries
refreshTokenSchema.index({ user_id: 1 });
refreshTokenSchema.index({ token: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
