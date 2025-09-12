const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const createGoal = async (req, res) => {
  try {
    const { amount, targetDate } = req.body;
    const userId = req.user._id;
    const goal = await Goal.create({ userId, amount, targetDate });
    await User.findByIdAndUpdate(userId, { $push: { goals: goal._id } });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const goals = await Goal.find({ userId }).populate('userId', 'name');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGoal, getGoals };