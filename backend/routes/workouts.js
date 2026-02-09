const express = require('express');
const router = express.Router();
const maxBodySize = '1mb'; // Or middleware specific config?
// Express Router doesn't take body size option directly here usually.
// Just use standard router.

const workoutController = require('../controllers/workoutController');
const { auth } = require('../middleware/auth');

router.post('/', auth, workoutController.createLog);
router.get('/', auth, workoutController.getLogs);

module.exports = router;
