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

// @desc   Get daily nutrition log
// @route  GET /api/nutrition/daily?date=YYYY-MM-DD
// @access Private
const getDailyLog = async (req, res) => {
    try {
        const dateStr = toDateStr(req.query.date);
        const log = await MealLog.getDailyLog(req.user.id, dateStr);
        const calorieGoal = calcCalorieGoal(req.user);

        res.json({
            success: true,
            data: {
                ...log,
                calorie_goal: log.calorie_goal || calorieGoal
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
        const userGoals = goals || { calories: calcCalorieGoal(req.user), protein: 150, carbs: 250, fat: 65 };
        const log = await MealLog.addFoodItem(req.user.id, dateStr, meal_type, food, userGoals);

        res.json({ success: true, data: log });
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

        res.json({ success: true, data: log });
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
        const summary = await MealLog.getWeeklySummary(req.user.id);
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
        const goal = calcCalorieGoal(req.user);
        res.json({ success: true, data: { calorie_goal: goal } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to calculate goal' });
    }
};

// @desc   Update nutrition goals
// @route  PUT /api/nutrition/goals
// @access Private
const updateGoals = async (req, res) => {
    try {
        const { date, calories, protein, carbs, fat } = req.body;
        if (!calories && !protein && !carbs && !fat) {
            return res.status(400).json({ success: false, message: 'At least one goal value is required' });
        }
        const dateStr = toDateStr(date);
        const goals = {};
        if (calories) goals.calories = Number(calories);
        if (protein) goals.protein = Number(protein);
        if (carbs) goals.carbs = Number(carbs);
        if (fat) goals.fat = Number(fat);
        const result = await MealLog.updateGoal(req.user.id, dateStr, goals);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('updateGoals error:', error);
        res.status(500).json({ success: false, message: 'Failed to update goals' });
    }
};

module.exports = { getDailyLog, addFoodItem, removeFoodItem, updateWater, getWeeklySummary, getCalorieGoal, updateGoals };

