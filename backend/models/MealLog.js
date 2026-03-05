const MealLogModel = require('./MealLogSchema');

class MealLog {

    // Get or create today's log for a user
    static async getOrCreate(userId, dateStr, goals = {}) {
        let log = await MealLogModel.findOne({ user_id: userId, log_date: dateStr });
        if (!log) {
            log = await MealLogModel.create({
                user_id: userId,
                log_date: dateStr,
                calorie_goal: goals.calories || 2000,
                protein_goal: goals.protein || 150,
                carbs_goal: goals.carbs || 250,
                fat_goal: goals.fat || 65,
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: []
            });
        }
        return log;
    }

    // Get daily log - returns structured data with totals
    static async getDailyLog(userId, dateStr) {
        const log = await MealLogModel.findOne({ user_id: userId, log_date: dateStr }).lean();
        if (!log) {
            return {
                log_date: dateStr,
                calorie_goal: 2000,
                water_glasses: 0,
                water_goal: 8,
                breakfast: [],
                lunch: [],
                dinner: [],
                snacks: [],
                totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            };
        }
        return { ...log, totals: MealLog._calcTotals(log) };
    }

    // Add a food item to a specific meal
    static async addFoodItem(userId, dateStr, mealType, foodItem, goals) {
        const validMeals = ['breakfast', 'lunch', 'dinner', 'snacks'];
        if (!validMeals.includes(mealType)) throw new Error('Invalid meal type');

        const log = await MealLog.getOrCreate(userId, dateStr, goals);

        log[mealType].push({
            name: foodItem.name,
            brand: foodItem.brand || null,
            quantity: foodItem.quantity,
            calories: Math.round(foodItem.calories),
            protein: Math.round(foodItem.protein * 10) / 10 || 0,
            carbs: Math.round(foodItem.carbs * 10) / 10 || 0,
            fat: Math.round(foodItem.fat * 10) / 10 || 0,
            fiber: Math.round(foodItem.fiber * 10) / 10 || 0
        });

        await log.save();
        const updated = log.toObject();
        return { ...updated, totals: MealLog._calcTotals(updated) };
    }

    // Remove a food item from a meal
    static async removeFoodItem(userId, dateStr, mealType, itemId) {
        const validMeals = ['breakfast', 'lunch', 'dinner', 'snacks'];
        if (!validMeals.includes(mealType)) throw new Error('Invalid meal type');

        const log = await MealLogModel.findOne({ user_id: userId, log_date: dateStr });
        if (!log) throw new Error('Log not found');

        log[mealType] = log[mealType].filter(item => item._id.toString() !== itemId);
        await log.save();

        const updated = log.toObject();
        return { ...updated, totals: MealLog._calcTotals(updated) };
    }

    // Update water intake
    static async updateWater(userId, dateStr, glasses) {
        const log = await MealLog.getOrCreate(userId, dateStr);
        log.water_glasses = Math.max(0, Math.min(glasses, 20));
        await log.save();
        return { water_glasses: log.water_glasses, water_goal: log.water_goal };
    }

    // Update all nutrition goals for a date
    static async updateGoal(userId, dateStr, goals) {
        const log = await MealLog.getOrCreate(userId, dateStr, goals);
        if (goals.calories) log.calorie_goal = goals.calories;
        if (goals.protein) log.protein_goal = goals.protein;
        if (goals.carbs) log.carbs_goal = goals.carbs;
        if (goals.fat) log.fat_goal = goals.fat;
        await log.save();
        return {
            calorie_goal: log.calorie_goal,
            protein_goal: log.protein_goal,
            carbs_goal: log.carbs_goal,
            fat_goal: log.fat_goal
        };
    }

    // Get last 7 days summary
    static async getWeeklySummary(userId, calorieGoal = 2000) {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }

        const logs = await MealLogModel.find({
            user_id: userId,
            log_date: { $in: days }
        }).lean();

        return days.map(date => {
            const log = logs.find(l => l.log_date === date);
            if (!log) return { date, calories: 0, goal: calorieGoal, protein: 0, carbs: 0, fat: 0 };
            const totals = MealLog._calcTotals(log);
            return { date, calories: totals.calories, goal: log.calorie_goal || calorieGoal, ...totals };
        });
    }

    // Internal: calculate totals from all four meal arrays
    static _calcTotals(log) {
        const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
        const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        meals.forEach(meal => {
            (log[meal] || []).forEach(item => {
                totals.calories += item.calories || 0;
                totals.protein += item.protein || 0;
                totals.carbs += item.carbs || 0;
                totals.fat += item.fat || 0;
                totals.fiber += item.fiber || 0;
            });
        });
        // Round all
        Object.keys(totals).forEach(k => { totals[k] = Math.round(totals[k] * 10) / 10; });
        return totals;
    }
}

module.exports = MealLog;
