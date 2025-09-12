const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Goal = require('../models/Goal');

const getAnalytics = async (req, res) => {
  try {
    const filterUser = req.query.userId ? new mongoose.Types.ObjectId(req.query.userId) : null;
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const twentyOneDaysAgo = new Date(now - 21 * 24 * 60 * 60 * 1000);

    // Active Parents this month: users with deposits this month
    const activeParentsAgg = await User.aggregate([
      { $match: filterUser ? { _id: filterUser } : {} },
      {
        $lookup: {
          from: 'transactions',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] },
                type: 'deposit',
                date: { $gte: thisMonth },
              },
            },
          ],
          as: 'deposits',
        },
      },
      { $match: { 'deposits.0': { $exists: true } } },
      { $count: 'active' },
    ]);
    const activeParents = activeParentsAgg[0]?.active || 0;

    // Deposit Success Rate
    const deposits = await Transaction.find({
      type: 'deposit',
      date: { $gte: thisMonth },
      ...(filterUser ? { userId: filterUser } : {}),
    });
    const successfulDeposits = deposits.filter(t => t.status === 'success').length;
    const totalDeposits = deposits.length;
    const successRate = totalDeposits > 0 ? (successfulDeposits / totalDeposits) * 100 : 0;

    // Average Deposit Size & Frequency (per user this month)
    const avgDepositSize = deposits.reduce((sum, t) => sum + t.amount, 0) / totalDeposits || 0;
    const frequency = {}; // userId -> count
    deposits.forEach(t => frequency[t.userId] = (frequency[t.userId] || 0) + 1);
    const avgFrequency = Object.values(frequency).reduce((sum, f) => sum + f, 0) / Object.keys(frequency).length || 0;

    // Withdrawal Ratio
    const withdrawals = await Transaction.find({
      type: 'withdrawal',
      status: 'approved',
      date: { $gte: thisMonth },
      ...(filterUser ? { userId: filterUser } : {}),
    });
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0, 0);
    const totalDepositsAmount = deposits.reduce((sum, t) => sum + t.amount, 0, 0);
    const withdrawalRatio = totalDepositsAmount > 0 ? totalWithdrawals / totalDepositsAmount : 0;

    // Simple Funnel
    const registeredThisMonth = await Transaction.countDocuments({
      eventType: 'registration',
      date: { $gte: thisMonth },
      ...(filterUser ? { userId: filterUser } : {}),
    });
    const goalsThisMonth = await Transaction.countDocuments({
      eventType: 'goal_created',
      date: { $gte: thisMonth },
      ...(filterUser ? { userId: filterUser } : {}),
    });
    const firstDepositsThisMonthAgg = await Transaction.aggregate([
      {
        $match: {
          eventType: 'deposit',
          status: 'success',
          date: { $gte: thisMonth },
          ...(filterUser ? { userId: filterUser } : {}),
        },
      },
      { $group: { _id: '$userId' } },
      { $count: 'firstDeposits' },
    ]);
    const firstDepositsThisMonth = firstDepositsThisMonthAgg[0]?.firstDeposits || 0;

    // Total deposits & withdrawals
    const totalDepositsAmountAll = (await Transaction.find({
      type: 'deposit',
      status: 'success',
      ...(filterUser ? { userId: filterUser } : {}),
    })).reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawalsAmountAll = (await Transaction.find({
      type: 'withdrawal',
      status: 'approved',
      ...(filterUser ? { userId: filterUser } : {}),
    })).reduce((sum, t) => sum + t.amount, 0);

    // Daily deposits trend (last 30 days)
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const dailyDeposits = await Transaction.aggregate([
      {
        $match: {
          type: 'deposit',
          status: 'success',
          date: { $gte: thirtyDaysAgo },
          ...(filterUser ? { userId: filterUser } : {}),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Top 5 most consistent savers (highest frequency deposits this month)
    const topSavers = await Transaction.aggregate([
      {
        $match: {
          type: 'deposit',
          status: 'success',
          date: { $gte: thisMonth },
          ...(filterUser ? { userId: filterUser } : {}),
        },
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: '$user.name',
          frequency: '$count',
          totalSaved: '$totalAmount',
        },
      },
    ]);

    // Nudge list: no deposits in last 21 days
    const nudgeList = await User.aggregate([
      { $match: { ...(filterUser ? { _id: filterUser } : {}), role: 'parent' } },
      {
        $lookup: {
          from: 'transactions',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] },
                type: 'deposit',
                date: { $gte: twentyOneDaysAgo },
              },
            },
          ],
          as: 'recentDeposits',
        },
      },
      { $match: { recentDeposits: { $size: 0 } } },
      {
        $project: {
          name: '$name',
          email: '$email',
          daysSinceLast: { $divide: [{ $subtract: [now, '$lastDeposit'] }, 24 * 60 * 60 * 1000] },
        },
      },
    ]);

    res.json({
      activeParents,
      depositSuccessRate: successRate,
      avgDepositSize,
      avgFrequency,
      withdrawalRatio,
      funnel: {
        registered: registeredThisMonth,
        goalsCreated: goalsThisMonth,
        firstDeposits: firstDepositsThisMonth,
      },
      totals: { deposits: totalDepositsAmountAll, withdrawals: totalWithdrawalsAmountAll },
      dailyDeposits,
      topSavers,
      nudgeList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };