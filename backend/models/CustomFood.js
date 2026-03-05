const CustomFoodModel = require('./CustomFoodSchema');

class CustomFood {

    // Get all saved foods for a user (optionally filtered by query string)
    static async getAll(userId, query = '') {
        const filter = { user_id: userId };
        if (query && query.trim().length >= 1) {
            filter.name = { $regex: query.trim(), $options: 'i' };
        }
        const foods = await CustomFoodModel
            .find(filter)
            .sort({ name: 1 })
            .lean();
        return foods.map(f => ({ ...f, id: f._id }));
    }

    // Create a new saved food
    static async create(userId, data) {
        const food = await CustomFoodModel.create({
            user_id: userId,
            name: data.name.trim(),
            brand: data.brand || null,
            calories: Number(data.calories) || 0,
            protein: Number(data.protein) || 0,
            carbs: Number(data.carbs) || 0,
            fat: Number(data.fat) || 0,
            fiber: Number(data.fiber) || 0,
            default_quantity: Number(data.default_quantity) || 100
        });
        return { ...food.toObject(), id: food._id };
    }

    // Delete a saved food (only the owner can delete it)
    static async delete(userId, foodId) {
        const result = await CustomFoodModel.findOneAndDelete({
            _id: foodId,
            user_id: userId
        });
        return result !== null;
    }
}

module.exports = CustomFood;
