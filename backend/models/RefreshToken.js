const RefreshTokenModel = require('./RefreshTokenSchema');

class RefreshToken {
    // Create a new refresh token
    static async create(userId, token, expiresAt) {
        const refreshToken = await RefreshTokenModel.create({
            user_id: userId,
            token,
            expires_at: expiresAt
        });

        return {
            id: refreshToken._id,
            user_id: refreshToken.user_id,
            token: refreshToken.token,
            expires_at: refreshToken.expires_at
        };
    }

    // Find refresh token
    static async findByToken(token) {
        const refreshToken = await RefreshTokenModel.findOne({
            token,
            expires_at: { $gt: new Date() }
        }).lean();

        if (!refreshToken) return null;

        return {
            ...refreshToken,
            id: refreshToken._id,
            _id: undefined
        };
    }

    // Delete refresh token (logout)
    static async deleteByToken(token) {
        await RefreshTokenModel.findOneAndDelete({ token });
    }

    // Delete all user tokens (logout from all devices)
    static async deleteAllUserTokens(userId) {
        await RefreshTokenModel.deleteMany({ user_id: userId });
    }

    // Clean up expired tokens
    static async cleanupExpired() {
        await RefreshTokenModel.deleteMany({
            expires_at: { $lt: new Date() }
        });
    }
}

module.exports = RefreshToken;
