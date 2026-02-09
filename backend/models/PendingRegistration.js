const PendingRegistrationModel = require('./PendingRegistrationSchema');
const bcrypt = require('bcryptjs');

class PendingRegistration {
    /**
     * Create or update a pending registration
     * If email already exists, it will update with new data and reset expiry
     */
    static async create(email, password, name, gender, dateOfBirth) {
        const normalizedEmail = email.toLowerCase();
        const passwordHash = await bcrypt.hash(password, 12);

        // Use findOneAndUpdate with upsert to handle duplicate registrations
        const pendingReg = await PendingRegistrationModel.findOneAndUpdate(
            { email: normalizedEmail },
            {
                email: normalizedEmail,
                password_hash: passwordHash,
                name,
                gender,
                date_of_birth: dateOfBirth,
                created_at: new Date(),
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // Reset expiry to 24 hours
            },
            {
                upsert: true, // Create if doesn't exist
                new: true,    // Return updated document
                setDefaultsOnInsert: true
            }
        ).lean();

        return {
            email: pendingReg.email,
            name: pendingReg.name,
            gender: pendingReg.gender,
            date_of_birth: pendingReg.date_of_birth,
            created_at: pendingReg.created_at,
            expires_at: pendingReg.expires_at
        };
    }

    /**
     * Find pending registration by email
     */
    static async findByEmail(email) {
        const normalizedEmail = email.toLowerCase();
        const pendingReg = await PendingRegistrationModel.findOne({
            email: normalizedEmail,
            expires_at: { $gt: new Date() } // Only return non-expired
        }).lean();

        if (!pendingReg) return null;

        return {
            email: pendingReg.email,
            password_hash: pendingReg.password_hash,
            name: pendingReg.name,
            gender: pendingReg.gender,
            date_of_birth: pendingReg.date_of_birth,
            created_at: pendingReg.created_at,
            expires_at: pendingReg.expires_at
        };
    }

    /**
     * Delete pending registration after successful verification
     */
    static async delete(email) {
        const normalizedEmail = email.toLowerCase();
        await PendingRegistrationModel.deleteOne({ email: normalizedEmail });
    }

    /**
     * Manual cleanup of expired pending registrations
     * (MongoDB TTL index will also auto-cleanup, but this can be called manually)
     */
    static async cleanup() {
        const result = await PendingRegistrationModel.deleteMany({
            expires_at: { $lt: new Date() }
        });
        return result.deletedCount;
    }
}

module.exports = PendingRegistration;
