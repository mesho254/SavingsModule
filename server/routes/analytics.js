const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { protect, adminProtect } = require('../middlewares/auth');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get analytics (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/', adminProtect, getAnalytics);

module.exports = router;