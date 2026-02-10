const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { auth } = require('../middleware/auth');

router.post('/', auth, planController.createPlan);
router.get('/', auth, planController.getPlans);

router.delete('/:id', auth, planController.deletePlan);
router.put('/:id', auth, planController.updatePlan);

module.exports = router;
