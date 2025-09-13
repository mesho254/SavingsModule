import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 
import './AdminTransactions.css';

const AdminTransactions = () => {
  const { user } = useContext(AuthContext);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [reconciliationData, setReconciliationData] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingWithdrawals = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions/withdrawals/pending', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPendingWithdrawals(response.data);
    } catch (err) {
      setError('Failed to fetch pending withdrawals');
    }
  }, [user.token]);

  const fetchReconciliationData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reconciliation/check', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReconciliationData(response.data);
    } catch (err) {
      setError('Failed to fetch reconciliation data');
    }
  }, [user.token]);

  useEffect(() => {
    if (user && user.token) {
      fetchPendingWithdrawals();
      fetchReconciliationData();
    }
  }, [user, fetchPendingWithdrawals, fetchReconciliationData]);

  const handleAction = async (transaction, action) => {
    setSelectedTransaction(transaction);
    if (action === 'reject') {
      setOpen(true);
    } else {
      handleConfirmAction(transaction, action);
    }
  };

  const handleConfirmAction = async (transaction, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/transactions/withdrawal/${transaction._id}`,
        {
          action,
          reason: reason || undefined,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSuccess(`Withdrawal request ${action}ed successfully`);
      fetchPendingWithdrawals();
      setOpen(false);
      setReason('');
    } catch (err) {
      setError(`Failed to ${action} withdrawal request`);
    }
  };

  return (
    <div className="admin-transactions">
      <h2>Admin Transaction Management</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {reconciliationData && (
        <div className="health-check">
          <h3>System Health Check</h3>
          <p>Status: {reconciliationData.status}</p>
          {reconciliationData.balanceDiscrepancies.length > 0 && (
            <>
              <div className="alert alert-warning">
                Found {reconciliationData.balanceDiscrepancies.length} balance discrepancies
              </div>
              <h4>Balance Discrepancies Details:</h4>
              <ul>
                {reconciliationData.balanceDiscrepancies.map((disc, index) => (
                  <li key={index}>
                    Goal ID: {disc.goalId}, Stored Balance: ${disc.storedBalance}, 
                    Calculated Balance: ${disc.calculatedBalance}, Difference: ${disc.difference}
                  </li>
                ))}
              </ul>
            </>
          )}
          {reconciliationData.potentialDuplicates.length > 0 && (
            <div className="alert alert-warning">
              Found {reconciliationData.potentialDuplicates.length} potential duplicate transactions
            </div>
          )}
          {reconciliationData.integrityViolations && reconciliationData.integrityViolations.length > 0 && (
            <div className="alert alert-warning">
              Found {reconciliationData.integrityViolations.length} integrity violations
            </div>
          )}
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Amount</th>
              <th>Goal</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingWithdrawals.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.userId.name}</td>
                <td>${transaction.amount}</td>
                <td>
                  {transaction.goalId ? `$${transaction.goalId.amount} (Target)` : 'N/A'}
                </td>
                <td>{transaction.description}</td>
                <td>
                  <button
                    className="button button-primary"
                    onClick={() => handleAction(transaction, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="button button-error"
                    onClick={() => handleAction(transaction, 'reject')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Withdrawal Request</h3>
            </div>
            <div className="modal-body">
              <label>
                Reason for rejection
                <input
                  type="text"
                  className="input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  autoFocus
                />
              </label>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="button button-error"
                onClick={() => handleConfirmAction(selectedTransaction, 'reject')}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;