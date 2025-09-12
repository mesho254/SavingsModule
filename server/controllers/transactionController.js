const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');
const User = require('../models/User');

const deposit = async (req, res) => {
  try {
    const { amount, goalId, description } = req.body;
    const userId = req.user._id;
    const success = Math.random() > 0.1; // Mock 10% fail rate
    const status = success ? 'success' : 'failed';
    const transaction = await Transaction.create({
      userId,
      goalId,
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
    const { amount, goalId, description } = req.body;
    const userId = req.user._id;
    const transaction = await Transaction.create({
      userId,
      goalId,
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

module.exports = { deposit, withdrawalRequest, getLedger, getAllLedger };