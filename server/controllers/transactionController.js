const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const User = require('../models/User');

const deposit = async (req, res) => {
  try {
    const { amount, goalId, description, idempotencyKey } = req.body;
    const userId = req.user._id;

    // Check for existing transaction with same idempotency key
    if (idempotencyKey) {
      const existingTransaction = await Transaction.findOne({ idempotencyKey });
      if (existingTransaction) {
        return res.status(200).json(existingTransaction); // Return existing transaction
      }
    }

    const success = Math.random() > 0.1; // Mock 10% fail rate
    const status = success ? 'success' : 'failed';
    const transaction = await Transaction.create({
      userId,
      goalId,
      idempotencyKey,
      type: 'deposit',
      amount,
      status,
      description,
      eventType: 'deposit',
    });
    if (success && goalId) {
      await Goal.findByIdAndUpdate(goalId, { $inc: { currentBalance: amount } });
      await User.findByIdAndUpdate(userId, { lastDeposit: new Date() });
    }
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const withdrawalRequest = async (req, res) => {
  try {
    const { amount, goalId, description, idempotencyKey } = req.body;
    const userId = req.user._id;

    // Check for existing withdrawal request with same idempotency key
    if (idempotencyKey) {
      const existingTransaction = await Transaction.findOne({ idempotencyKey });
      if (existingTransaction) {
        return res.status(200).json(existingTransaction);
      }
    }
    const transaction = await Transaction.create({
      userId,
      goalId,
      idempotencyKey,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description,
      eventType: 'withdrawal',
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLedger = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .populate('goalId', 'amount targetDate');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLedger = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const transactions = await Transaction.find({})
      .sort({ date: -1 })
      .populate('goalId', 'amount targetDate')
      .populate('userId', 'name');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Approve or reject withdrawal requests
const handleWithdrawalRequest = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { action, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid transaction state' });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    
    if (status === 'approved') {
      // Update goal balance when withdrawal is approved
      await Goal.findByIdAndUpdate(transaction.goalId, {
        $inc: { currentBalance: -transaction.amount }
      });
    }

    transaction.status = status;
    transaction.description = reason ? `${transaction.description} | ${reason}` : transaction.description;
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get pending withdrawal requests
const getPendingWithdrawals = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      type: 'withdrawal',
      status: 'pending'
    })
      .sort({ date: -1 })
      .populate('goalId', 'amount targetDate')
      .populate('userId', 'name');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  deposit, 
  withdrawalRequest, 
  getLedger, 
  getAllLedger, 
  handleWithdrawalRequest, 
  getPendingWithdrawals 
};