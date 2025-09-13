const express = require('express');
const { checkReconciliation } = require('../controllers/reconciliationController');
const router = express.Router();
const { protect, adminProtect } = require('../middlewares/auth');


const { isAdmin } = require('../middlewares/admin');

router.use(protect);
router.use(isAdmin);


/**
 * @swagger
 * /api/reconciliation/check:
 *   get:
 *     summary: Verify goal balances
 *     tags: [Reconciliation]
 *     responses:
 *       200:
 *         description: Goal balances verified successfully
 *       500:
 *         description: Internal server error
 */
router.get('/check', checkReconciliation);

module.exports = router;