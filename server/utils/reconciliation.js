const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

// Verify transaction totals match goal balances
const verifyGoalBalances = async () => {
  const goals = await Goal.find({});
  const discrepancies = [];

  for (const goal of goals) {
    const transactions = await Transaction.find({
      goalId: goal._id,
      status: 'success'
    });

    const calculatedBalance = transactions.reduce((acc, curr) => {
      return curr.type === 'deposit' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    if (calculatedBalance !== goal.currentBalance) {
      discrepancies.push({
        goalId: goal._id,
        storedBalance: goal.currentBalance,
        calculatedBalance,
        difference: goal.currentBalance - calculatedBalance
      });
    }
  }

  return discrepancies;
};

// Find any duplicate transactions (same amount, type, and timestamp within 1 minute)
const findPotentialDuplicates = async () => {
  const transactions = await Transaction.find({}).sort({ date: 1 });
  const potentialDuplicates = [];

  for (let i = 0; i < transactions.length - 1; i++) {
    const current = transactions[i];
    const next = transactions[i + 1];

    if (
      current.amount === next.amount &&
      current.type === next.type &&
      current.userId.equals(next.userId) &&
      current.goalId?.equals(next.goalId) &&
      Math.abs(current.date - next.date) <= 60000 // Within 1 minute
    ) {
      potentialDuplicates.push({ current, next });
    }
  }

  return potentialDuplicates;
};

// Verify transaction integrity (no negative balances at any point)
const verifyTransactionIntegrity = async () => {
  const goals = await Goal.find({});
  const violations = [];

  for (const goal of goals) {
    const transactions = await Transaction.find({
      goalId: goal._id,
      status: 'success'
    }).sort({ date: 1 });

    let runningBalance = 0;
    for (const transaction of transactions) {
      if (transaction.type === 'deposit') {
        runningBalance += transaction.amount;
      } else {
        runningBalance -= transaction.amount;
        if (runningBalance < 0) {
          violations.push({
            goalId: goal._id,
            transactionId: transaction._id,
            date: transaction.date,
            balanceAfterTransaction: runningBalance
          });
        }
      }
    }
  }

  return violations;
};

module.exports = {
  verifyGoalBalances,
  findPotentialDuplicates,
  verifyTransactionIntegrity
};