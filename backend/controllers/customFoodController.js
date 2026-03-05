const CustomFood = require('../models/CustomFood');

// @desc   Get all saved custom foods (optionally filtered by search query)
// @route  GET /api/custom-foods?q=query
// @access Private
const getCustomFoods = async (req, res) => {
    try {
        const query = req.query.q || '';
        const foods = await CustomFood.getAll(req.user.id, query);
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error('getCustomFoods error:', error);
        res.status(500).json({ success: false, message: 'Failed to get custom foods' });
    }
};

// @desc   Save a new custom food
// @route  POST /api/custom-foods
// @access Private
const createCustomFood = async (req, res) => {
    try {
        const { name, brand, calories, protein, carbs, fat, fiber, default_quantity } = req.body;
        if (!name || !calories) {
            return res.status(400).json({ success: false, message: 'name and calories are required' });
        }

        // Prevent duplicates: check if a food with this name already exists for the user
        const existing = await require('../models/CustomFoodSchema').findOne({
            user_id: req.user.id,
            name: { $regex: `^${name.trim()}$`, $options: 'i' }
        });
        if (existing) {
            return res.status(409).json({ success: false, message: `"${name}" is already saved in My Foods`, duplicate: true });
        }

        const food = await CustomFood.create(req.user.id, {
            name, brand, calories, protein, carbs, fat, fiber, default_quantity
        });
        res.status(201).json({ success: true, data: food });
    } catch (error) {
        console.error('createCustomFood error:', error);
        res.status(500).json({ success: false, message: 'Failed to save custom food' });
    }
};

// @desc   Delete a saved custom food
// @route  DELETE /api/custom-foods/:id
// @access Private
const deleteCustomFood = async (req, res) => {
    try {
        const deleted = await CustomFood.delete(req.user.id, req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Custom food not found' });
        }
        res.json({ success: true, message: 'Custom food deleted' });
    } catch (error) {
        console.error('deleteCustomFood error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete custom food' });
    }
};

module.exports = { getCustomFoods, createCustomFood, deleteCustomFood };
