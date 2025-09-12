const express = require('express');
const { approveWithdrawal, rejectWithdrawal, getPendingWithdrawals } = require('../controllers/adminController');
const { protect, adminProtect } = require('../middlewares/auth');
const router = express.Router();

router.use(protect);
router.use(adminProtect);

/**
 * @swagger
 * /api/admin/approve:
 *   post:
 *     summary: Approve withdrawal (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Approved
 */
router.post('/approve', approveWithdrawal);

/**
 * @swagger
 * /api/admin/reject:
 *   post:
 *     summary: Reject withdrawal (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rejected
 */
router.post('/reject', rejectWithdrawal);

/**
 * @swagger
 * /api/admin/pending:
 *   get:
 *     summary: Get pending withdrawals (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending list
 */
router.get('/pending', getPendingWithdrawals);

module.exports = router;