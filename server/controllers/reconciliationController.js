const { verifyGoalBalances, findPotentialDuplicates, verifyTransactionIntegrity } = require('../utils/reconciliation');

const checkReconciliation = async (req, res) => {
  try {
    const [balanceDiscrepancies, potentialDuplicates, integrityViolations] = await Promise.all([
      verifyGoalBalances(),
      findPotentialDuplicates(),
      verifyTransactionIntegrity()
    ]);

    res.json({
      balanceDiscrepancies,
      potentialDuplicates,
      integrityViolations,
      status: 
        balanceDiscrepancies.length === 0 &&
        potentialDuplicates.length === 0 &&
        integrityViolations.length === 0 ? 'healthy' : 'issues-found'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  checkReconciliation
};