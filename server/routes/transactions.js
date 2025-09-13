const express = require('express');
const { 
  deposit, 
  withdrawalRequest, 
  getLedger, 
  getAllLedger,
  handleWithdrawalRequest,
  getPendingWithdrawals
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/auth');
const { canManageTransactions } = require('../middlewares/admin');
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Make a deposit
 *     tags: [Transactions]
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
 *               goalId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deposit processed
 */
router.post('/deposit', deposit);

/**
 * @swagger
 * /api/transactions/withdrawal:
 *   post:
 *     summary: Request withdrawal
 *     tags: [Transactions]
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
 *               goalId:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request submitted
 */
router.post('/withdrawal', withdrawalRequest);

/**
 * @swagger
 * /api/transactions/ledger:
 *   get:
 *     summary: Get user's ledger
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ledger entries
 */
router.get('/ledger', getLedger);

/**
 * @swagger
 * /api/transactions/ledger/all:
 *   get:
 *     summary: Get all ledger (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All ledger entries
 *       403:
 *         description: Access denied
 */
router.get('/ledger/all', getAllLedger);

/**
 * @swagger
 * /api/transactions/withdrawals/pending:
 *   get:
 *     summary: Get pending withdrawal requests (admin/manager only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending withdrawal requests
 *       403:
 *         description: Access denied
 */
router.get('/withdrawals/pending', protect, canManageTransactions, getPendingWithdrawals);

/**
 * @swagger
 * /api/transactions/withdrawal/{transactionId}:
 *   put:
 *     summary: Approve or reject withdrawal request (admin/manager only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Withdrawal request updated
 *       403:
 *         description: Access denied
 */
router.put('/withdrawal/:transactionId', protect, canManageTransactions, handleWithdrawalRequest);

module.exports = router;