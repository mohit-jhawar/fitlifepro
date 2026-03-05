const MealLog = require('../models/MealLog');

// Helper: get today's date string in YYYY-MM-DD
const toDateStr = (dateInput) => {
    if (!dateInput) return new Date().toISOString().split('T')[0];
    return new Date(dateInput).toISOString().split('T')[0];
};

// Calculate calorie goal using Mifflin-St Jeor + activity factor
const calcCalorieGoal = (user) => {
    if (!user || !user.weight || !user.height) return 2000;
    const age = user.date_of_birth
        ? Math.floor((Date.now() - new Date(user.date_of_birth)) / (365.25 * 24 * 3600 * 1000))
        : 25;
    const gender = user.gender || 'male';
    const weight = Number(user.weight) || 70;
    const height = Number(user.height) || 170;

    // BMR
    let bmr = gender === 'female'
        ? 10 * weight + 6.25 * height - 5 * age - 161
        : 10 * weight + 6.25 * height - 5 * age + 5;

    // Moderate activity multiplier (1.55)
    return Math.round(bmr * 1.55);
};

// Helper: build the goals object from user profile (with BMR fallback)
const getUserGoals = (user) => {
    const bmrCalorie = calcCalorieGoal(user);
    return {
        calories: user.calorie_goal || bmrCalorie,
        protein: user.protein_goal || 150,
        carbs: user.carbs_goal || 250,
        fat: user.fat_goal || 65
    };
};

// @desc   Get daily nutrition log
// @route  GET /api/nutrition/daily?date=YYYY-MM-DD
// @access Private
const getDailyLog = async (req, res) => {
    try {
        const dateStr = toDateStr(req.query.date);
        const log = await MealLog.getDailyLog(req.user.id, dateStr);
        const userGoals = getUserGoals(req.user);

        res.json({
            success: true,
            data: {
                ...log,
                // Always use the user-level goals (not the per-day log goals)
                calorie_goal: userGoals.calories,
                protein_goal: userGoals.protein,
                carbs_goal: userGoals.carbs,
                fat_goal: userGoals.fat,
                goals: userGoals
            }
        });
    } catch (error) {
        console.error('getDailyLog error:', error);
        res.status(500).json({ success: false, message: 'Failed to get daily log' });
    }
};

// @desc   Add food item to a meal
// @route  POST /api/nutrition/log
// @access Private
const addFoodItem = async (req, res) => {
    try {
        const { date, meal_type, food, goals } = req.body;

        if (!meal_type || !food || !food.name || !food.calories) {
            return res.status(400).json({ success: false, message: 'meal_type and food (name, calories) are required' });
        }

        const dateStr = toDateStr(date);
        // Use user-level goals as the authoritative source
        const userGoals = getUserGoals(req.user);
        const effectiveGoals = goals || userGoals;
        const log = await MealLog.addFoodItem(req.user.id, dateStr, meal_type, food, effectiveGoals);

        // Return with user-level goals
        res.json({
            success: true,
            data: {
                ...log,
                goals: userGoals
            }
        });
    } catch (error) {
        console.error('addFoodItem error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to add food item' });
    }
};

// @desc   Remove food item from a meal
// @route  DELETE /api/nutrition/log/item
// @access Private
const removeFoodItem = async (req, res) => {
    try {
        const { date, meal_type, item_id } = req.body;

        if (!meal_type || !item_id) {
            return res.status(400).json({ success: false, message: 'meal_type and item_id are required' });
        }

        const dateStr = toDateStr(date);
        const log = await MealLog.removeFoodItem(req.user.id, dateStr, meal_type, item_id);
        const userGoals = getUserGoals(req.user);

        res.json({
            success: true,
            data: {
                ...log,
                goals: userGoals
            }
        });
    } catch (error) {
        console.error('removeFoodItem error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to remove food item' });
    }
};

// @desc   Update water intake
// @route  PUT /api/nutrition/water
// @access Private
const updateWater = async (req, res) => {
    try {
        const { date, glasses } = req.body;
        if (glasses === undefined) {
            return res.status(400).json({ success: false, message: 'glasses is required' });
        }
        const dateStr = toDateStr(date);
        const result = await MealLog.updateWater(req.user.id, dateStr, glasses);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('updateWater error:', error);
        res.status(500).json({ success: false, message: 'Failed to update water intake' });
    }
};

// @desc   Get weekly nutrition summary
// @route  GET /api/nutrition/weekly
// @access Private
const getWeeklySummary = async (req, res) => {
    try {
        const userGoals = getUserGoals(req.user);
        const summary = await MealLog.getWeeklySummary(req.user.id, userGoals.calories);
        res.json({ success: true, data: summary });
    } catch (error) {
        console.error('getWeeklySummary error:', error);
        res.status(500).json({ success: false, message: 'Failed to get weekly summary' });
    }
};

// @desc   Get calorie goal for user
// @route  GET /api/nutrition/goal
// @access Private
const getCalorieGoal = async (req, res) => {
    try {
        const userGoals = getUserGoals(req.user);
        res.json({
            success: true,
            data: {
                calorie_goal: userGoals.calories,
                protein_goal: userGoals.protein,
                carbs_goal: userGoals.carbs,
                fat_goal: userGoals.fat,
                goals: userGoals
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get goal' });
    }
};

// @desc   Update nutrition goals – saved permanently to User profile
// @route  PUT /api/nutrition/goals
// @access Private
const updateGoals = async (req, res) => {
    try {
        const { date, calories, protein, carbs, fat } = req.body;
        if (!calories && !protein && !carbs && !fat) {
            return res.status(400).json({ success: false, message: 'At least one goal value is required' });
        }

        const UserSchema = require('../models/UserSchema');

        // Build update for User model
        const userUpdate = {};
        if (calories) userUpdate.calorie_goal = Number(calories);
        if (protein) userUpdate.protein_goal = Number(protein);
        if (carbs) userUpdate.carbs_goal = Number(carbs);
        if (fat) userUpdate.fat_goal = Number(fat);

        // Save goals to User profile (persists across dates & devices)
        await UserSchema.findByIdAndUpdate(req.user.id, userUpdate);

        // Also update today's MealLog for convenience (date filtering in weekly chart etc.)
        const dateStr = toDateStr(date);
        const mealLogUpdate = {};
        if (calories) mealLogUpdate.calories = Number(calories);
        if (protein) mealLogUpdate.protein = Number(protein);
        if (carbs) mealLogUpdate.carbs = Number(carbs);
        if (fat) mealLogUpdate.fat = Number(fat);
        try {
            await MealLog.updateGoal(req.user.id, dateStr, mealLogUpdate);
        } catch { /* non-critical, main save already done above */ }

        const savedGoals = {
            calories: userUpdate.calorie_goal || req.user.calorie_goal || calcCalorieGoal(req.user),
            protein: userUpdate.protein_goal || req.user.protein_goal || 150,
            carbs: userUpdate.carbs_goal || req.user.carbs_goal || 250,
            fat: userUpdate.fat_goal || req.user.fat_goal || 65
        };

        res.json({ success: true, data: { goals: savedGoals } });
    } catch (error) {
        console.error('updateGoals error:', error);
        res.status(500).json({ success: false, message: 'Failed to update goals' });
    }
};

module.exports = { getDailyLog, addFoodItem, removeFoodItem, updateWater, getWeeklySummary, getCalorieGoal, updateGoals };
