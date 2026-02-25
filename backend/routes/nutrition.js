const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    getDailyLog,
    addFoodItem,
    removeFoodItem,
    updateWater,
    getWeeklySummary,
    getCalorieGoal,
    updateGoals
} = require('../controllers/nutritionController');

// All nutrition routes require authentication
router.use(auth);

router.get('/daily', getDailyLog);
router.post('/log', addFoodItem);
router.delete('/log/item', removeFoodItem);
router.put('/water', updateWater);
router.put('/goals', updateGoals);
router.get('/weekly', getWeeklySummary);
router.get('/goal', getCalorieGoal);

module.exports = router;
