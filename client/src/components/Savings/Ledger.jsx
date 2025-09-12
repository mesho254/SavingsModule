import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable';
import { AuthContext } from '../../context/AuthContext'; 

const Ledger = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const [ledger, setLedger] = useState([]);
  const [filteredLedger, setFilteredLedger] = useState([]);
  const [activeTab, setActiveTab] = useState('my');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [downloadAll, setDownloadAll] = useState(true);

  useEffect(() => {
    if (!isAdmin && activeTab === 'all') {
      setActiveTab('my');
    }
  }, [isAdmin, activeTab]);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        let url = '/api/transactions/ledger';
        if (isAdmin && activeTab === 'all') {
          url = '/api/transactions/ledger/all';
        }
        const res = await axios.get(`http://localhost:5000${url}`);
        setLedger(res.data);
      } catch (error) {
        alert(error.response?.data?.message || error.message); 
      }
    };
    fetchLedger();
  }, [activeTab, isAdmin]);

  useEffect(() => {
    const types = [...new Set(ledger.map(t => t.type))];
    setUniqueTypes(types);
    const statuses = [...new Set(ledger.map(t => t.status))];
    setUniqueStatuses(statuses);
  }, [ledger]);

  useEffect(() => {
    const filtered = ledger.filter(t => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(t.date) > new Date(dateTo)) return false;
      return true;
    });
    setFilteredLedger(filtered);
    setCurrentPage(1);
  }, [ledger, typeFilter, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLedger = filteredLedger.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLedger.length / rowsPerPage);

  const getGoalDisplay = (t) => {
    if (!t.goalId) return '';
    const prefix = t.type === 'deposit' ? 'To' : 'From';
    return `${prefix}: ${t.goalId.amount} by ${new Date(t.goalId.targetDate).toLocaleDateString()}`;
  };

  const clearFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const downloadCSV = (data) => {
    const headers = activeTab === 'all' ? ['User', 'Type', 'Amount', 'Status', 'Goal', 'Description', 'Date'] : ['Type', 'Amount', 'Status', 'Goal', 'Description', 'Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(t => {
        let row = '';
        if (activeTab === 'all') {
          const userName = (t.userId?.name || '').replace(/,/g, ';');
          row = `"${userName}",`;
        }
        const goal = getGoalDisplay(t).replace(/,/g, ';');
        const desc = (t.description || '').replace(/,/g, ';');
        row += `${t.type},${t.amount},${t.status},"${goal}","${desc}",${new Date(t.date).toLocaleDateString()}`;
        return row;
      })
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ledger-${activeTab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${activeTab === 'all' ? 'All ' : ''}Ledger Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Records: ${data.length}`, 14, 35);
    const head = activeTab === 'all' ? [['User', 'Type', 'Amount', 'Status', 'Goal', 'Description', 'Date']] : [['Type', 'Amount', 'Status', 'Goal', 'Description', 'Date']];
    const body = data.map(t => {
      let row = [];
      if (activeTab === 'all') {
        row = [t.userId?.name || '', t.type, t.amount.toString(), t.status, getGoalDisplay(t), t.description || '', new Date(t.date).toLocaleDateString()];
      } else {
        row = [t.type, t.amount.toString(), t.status, getGoalDisplay(t), t.description || '', new Date(t.date).toLocaleDateString()];
      }
      return row;
    });
    autotable(doc, {
      startY: 45,
      head,
      body,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200] },
    });
    doc.save(`ledger-${activeTab}.pdf`);
  };

  const containerStyle = { border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: 'white', width: '100%', margin: '20px 0' };
  const tableWrapperStyle = {
    overflowX: 'auto',
    marginTop: '10px',
    WebkitOverflowScrolling: 'touch',
  };
  const tableStyle = {
    minWidth: activeTab === 'all' ? '800px' : '600px',
    width: '100%',
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
  };
  const thStyle = { border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', textAlign: 'left', whiteSpace: 'nowrap' };
  const tdStyle = { border: '1px solid #ddd', padding: '8px', whiteSpace: 'nowrap' };
  const paginationStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' };
  const paginationButtonStyle = { padding: '5px 10px', margin: '0 5px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white' };
  const disabledButtonStyle = { ...paginationButtonStyle, cursor: 'not-allowed', opacity: 0.5 };
  const selectStyle = { padding: '5px', border: '1px solid #ddd', borderRadius: '4px' };
  const filterStyle = { marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' };
  const downloadStyle = { marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' };
  const tabStyle = { display: 'flex', gap: '10px', marginBottom: '10px', justifyContent: 'center' };
  const tabButtonStyle = (active) => ({
    padding: '10px 20px',
    border: '1px solid #ddd',
    background: active ? '#007bff' : 'white',
    color: active ? 'white' : 'black',
    cursor: 'pointer',
    borderRadius: '4px',
  });

  const dataToDownload = downloadAll ? ledger : filteredLedger;

  return (
    <div style={containerStyle}>
      <div style={tabStyle}>
        <button onClick={() => setActiveTab('my')} style={tabButtonStyle(activeTab === 'my')}>
          My Ledger
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('all')} style={tabButtonStyle(activeTab === 'all')}>
            All Ledger
          </button>
        )}
      </div>
      <h2 style={{ textAlign: 'center' }}>{activeTab === 'all' ? 'All Ledger' : 'My Ledger'}</h2>
      <div style={filterStyle}>
        <label>Type: </label>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="">All</option>
          {uniqueTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label>Status: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All</option>
          {uniqueStatuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label>From: </label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={selectStyle} />
        <label>To: </label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={selectStyle} />
        <button onClick={clearFilters} style={paginationButtonStyle}>Clear Filters</button>
      </div>
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {activeTab === 'all' && <th style={thStyle}>User</th>}
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Goal</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentLedger.map((t) => (
              <tr key={t._id}>
                {activeTab === 'all' && <td style={tdStyle}>{t.userId?.name || ''}</td>}
                <td style={tdStyle}>{t.type}</td>
                <td style={tdStyle}>{t.amount}</td>
                <td style={tdStyle}>{t.status}</td>
                <td style={tdStyle}>{getGoalDisplay(t)}</td>
                <td style={tdStyle}>{t.description || ''}</td>
                <td style={tdStyle}>{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={paginationStyle}>
        <select 
          value={rowsPerPage} 
          onChange={(e) => setRowsPerPage(e.target.value === 'All' ? filteredLedger.length : Number(e.target.value))}
          style={selectStyle}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value="All">All</option>
        </select>
        <div>
          <button 
            style={currentPage === 1 ? disabledButtonStyle : paginationButtonStyle} 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            style={currentPage === totalPages ? disabledButtonStyle : paginationButtonStyle} 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <div style={downloadStyle}>
        <label>Download: </label>
        <input 
          type="checkbox" 
          checked={downloadAll} 
          onChange={(e) => setDownloadAll(e.target.checked)} 
        /> {downloadAll ? 'Full' : 'Filtered'} data
        <button onClick={() => downloadCSV(dataToDownload)} style={paginationButtonStyle}>CSV</button>
        <button onClick={() => downloadPDF(dataToDownload)} style={paginationButtonStyle}>PDF</button>
      </div>
    </div>
  ); 
};

export default Ledger;