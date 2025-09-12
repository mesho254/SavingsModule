const express = require('express');
const { deposit, withdrawalRequest, getLedger, getAllLedger } = require('../controllers/transactionController');
const { protect } = require('../middlewares/auth');
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

module.exports = router;