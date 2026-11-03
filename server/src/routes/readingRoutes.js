const express = require('express');
const router = express.Router();

console.log('Reading routes file loaded')

const {getReadingStats, updateReadingGoals} = require('../controllers/readingControllers');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, getReadingStats);
router.put('/goals', authMiddleware, updateReadingGoals);

module.exports = router;