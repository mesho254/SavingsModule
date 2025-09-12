const express = require('express');
const { createGoal, getGoals } = require('../controllers/goalController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a savings goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Goal created
 */
router.post('/', createGoal);

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get user's goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of goals
 */
router.get('/', getGoals);

module.exports = router;