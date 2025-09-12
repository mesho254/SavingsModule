const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

const approveWithdrawal = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid transaction' });
    }
    transaction.status = 'approved';
    await transaction.save();
    // Update goal balance if goalId exists
    if (transaction.goalId) {
      await Goal.findByIdAndUpdate(transaction.goalId, { $inc: { currentBalance: -transaction.amount } });
    }
    res.json({ message: 'Approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectWithdrawal = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Invalid transaction' });
    }
    transaction.status = 'rejected';
    await transaction.save();
    res.json({ message: 'Rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingWithdrawals = async (req, res) => {
  try {
    const filter = { type: 'withdrawal', status: 'pending' };
    if (req.query.userId) {
      filter.userId = new mongoose.Types.ObjectId(req.query.userId);
    }
    const transactions = await Transaction.find(filter)
      .populate('userId', 'name email')
      .populate('goalId', 'amount currentBalance targetDate')
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { approveWithdrawal, rejectWithdrawal, getPendingWithdrawals };