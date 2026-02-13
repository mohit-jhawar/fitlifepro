const AIChatLimitModel = require('./AIChatLimitSchema');

class AIChatLimit {
    static async getUsage(userId, date) {
        let usage = await AIChatLimitModel.findOne({ user_id: userId, date });
        if (!usage) {
            usage = await AIChatLimitModel.create({ user_id: userId, date, count: 0 });
        }
        return usage;
    }

    static async incrementUsage(userId, date) {
        return await AIChatLimitModel.findOneAndUpdate(
            { user_id: userId, date },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
    }

    static async isLimitReached(userId, limit = 5) {
        const today = new Date().toISOString().split('T')[0];
        const usage = await this.getUsage(userId, today);
        return usage.count >= limit;
    }
}

module.exports = AIChatLimit;
