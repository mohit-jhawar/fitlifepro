const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password_hash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', null],
        default: null
    },
    date_of_birth: {
        type: Date,
        default: null
    },
    profile_picture_url: {
        type: String,
        default: null
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    email_verification_token: {
        type: String,
        default: null
    },
    password_reset_token: {
        type: String,
        default: null
    },
    password_reset_expires: {
        type: Date,
        default: null
    },
    is_premium: {
        type: Boolean,
        default: false
    },
    subscription_expires_at: {
        type: Date,
        default: null
    },
    last_login: {
        type: Date,
        default: null
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
