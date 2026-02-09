const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    date_of_birth: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
    }
});

// Create TTL index for automatic cleanup
pendingRegistrationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const PendingRegistrationModel = mongoose.model('PendingRegistration', pendingRegistrationSchema);

module.exports = PendingRegistrationModel;
