const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
    },
    attempts: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
otpSchema.index({ email: 1, expiresAt: 1 });

// Static method to create OTP
otpSchema.statics.createOTP = async function (email, otp, expiryMinutes = 5) {
    // Delete any existing unverified OTPs for this email
    await this.deleteMany({ email, verified: false });

    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    return await this.create({
        email,
        otp,
        expiresAt
    });
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function (email, otp) {
    const otpRecord = await this.findOne({
        email,
        otp,
        verified: false,
        expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
        return null;
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    return otpRecord;
};

// Static method to check if can resend
otpSchema.statics.canResend = async function (email, cooldownSeconds = 60) {
    const recentOTP = await this.findOne({
        email,
        createdAt: { $gt: new Date(Date.now() - cooldownSeconds * 1000) }
    }).sort({ createdAt: -1 });

    return !recentOTP;
};

module.exports = mongoose.model('OTP', otpSchema);
