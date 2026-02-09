const UserModel = require('./UserSchema');
const UserMetricModel = require('./UserMetric');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class User {
    // Create a new user
    static async create({ email, password, name, gender, dateOfBirth }) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const user = await UserModel.create({
            email,
            password_hash: hashedPassword,
            name,
            gender,
            date_of_birth: dateOfBirth,
            email_verification_token: emailVerificationToken
        });

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                gender: user.gender,
                date_of_birth: user.date_of_birth,
                is_email_verified: user.is_email_verified,
                created_at: user.created_at
            },
            emailVerificationToken
        };
    }

    // Find user by email
    static async findByEmail(email) {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) return null;

        // Convert _id to id for compatibility
        return {
            ...user,
            id: user._id,
            _id: undefined
        };
    }

    // Find user by ID with latest metrics
    static async findById(id) {
        const user = await UserModel.findById(id).lean();
        if (!user) return null;

        // Get latest metrics
        const latestMetric = await UserMetricModel
            .findOne({ user_id: id })
            .sort({ recorded_at: -1 })
            .lean();

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            profile_picture_url: user.profile_picture_url,
            is_email_verified: user.is_email_verified,
            is_premium: user.is_premium,
            subscription_expires_at: user.subscription_expires_at,
            created_at: user.created_at,
            last_login: user.last_login,
            weight: latestMetric?.weight || null,
            height: latestMetric?.height || null,
            bmi: latestMetric?.bmi || null
        };
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Update last login
    static async updateLastLogin(userId) {
        await UserModel.findByIdAndUpdate(userId, {
            last_login: new Date()
        });
    }

    // Update user profile
    static async updateProfile(userId, updates) {
        const allowedFields = ['name', 'gender', 'date_of_birth', 'profile_picture_url'];
        const updateData = {};

        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key) && updates[key] !== undefined) {
                updateData[key] = updates[key];
            }
        });

        if (Object.keys(updateData).length === 0) {
            throw new Error('No valid fields to update');
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).lean();

        if (!user) return null;

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            profile_picture_url: user.profile_picture_url,
            is_email_verified: user.is_email_verified
        };
    }

    // Verify email
    static async verifyEmail(token) {
        const user = await UserModel.findOneAndUpdate(
            { email_verification_token: token },
            {
                is_email_verified: true,
                email_verification_token: null
            },
            { new: true }
        ).lean();

        if (!user) return null;

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            is_email_verified: user.is_email_verified
        };
    }

    // Create password reset token
    static async createPasswordResetToken(email) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        const user = await UserModel.findOneAndUpdate(
            { email },
            {
                password_reset_token: resetToken,
                password_reset_expires: resetExpires
            },
            { new: true }
        ).lean();

        if (!user) return null;

        return {
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            resetToken
        };
    }

    // Reset password
    static async resetPassword(token, newPassword) {
        const user = await UserModel.findOne({
            password_reset_token: token,
            password_reset_expires: { $gt: new Date() }
        });

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                password_hash: hashedPassword,
                password_reset_token: null,
                password_reset_expires: null
            },
            { new: true }
        ).lean();

        return {
            id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name
        };
    }

    // Change password (for logged-in users)
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await UserModel.findByIdAndUpdate(userId, {
            password_hash: hashedPassword
        });

        return true;
    }

    // Log new metrics
    static async logMetrics(userId, metrics) {
        const { weight, height, bmi, bodyFat, muscleMass } = metrics;

        const metric = await UserMetricModel.create({
            user_id: userId,
            weight,
            height,
            bmi,
            body_fat_percentage: bodyFat,
            muscle_mass: muscleMass
        });

        return {
            id: metric._id,
            user_id: metric.user_id,
            weight: metric.weight,
            height: metric.height,
            bmi: metric.bmi,
            body_fat_percentage: metric.body_fat_percentage,
            muscle_mass: metric.muscle_mass,
            recorded_at: metric.recorded_at
        };
    }

    // Delete user account
    static async deleteAccount(userId) {
        const result = await UserModel.findByIdAndDelete(userId);
        return result !== null;
    }
}

module.exports = User;
