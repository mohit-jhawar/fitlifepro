const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getCustomFoods, createCustomFood, deleteCustomFood } = require('../controllers/customFoodController');

router.use(auth);

router.get('/', getCustomFoods);
router.post('/', createCustomFood);
router.delete('/:id', deleteCustomFood);

module.exports = router;
