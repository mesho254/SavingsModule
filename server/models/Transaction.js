const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed', 'pending', 'approved', 'rejected'], default: 'success' }, // for deposits: success/failed (mock random fail), withdrawals: pending/approved/rejected
  description: { type: String },
  date: { type: Date, default: Date.now },
  eventType: { type: String, enum: ['registration', 'goal_created', 'deposit', 'withdrawal'], default: 'deposit' }, // for tracking events
});

module.exports = mongoose.model('Transaction', transactionSchema);