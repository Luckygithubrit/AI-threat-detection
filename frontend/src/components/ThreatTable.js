// src/components/ThreatTable.js
import React, { useState } from 'react';

const SEV_COLOR = { HIGH: '#ef4444', MEDIUM: '#f97316', LOW: '#22c55e' };

function ThreatTable({ threats }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = threats.filter(t => {
    const matchSev    = filter === 'ALL' || t.severity === filter;
    const matchSearch = !search ||
      t.ip?.includes(search) ||
      t.action?.includes(search) ||
      t.country?.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  });

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>📋 Threat Log</h2>
        <div className="table-controls">
          <input
            className="search-box"
            placeholder="Search IP, action, country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {['ALL','HIGH','MEDIUM','LOW'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="threat-table">
          <thead>
            <tr>
              <th>#</th>
              <th>IP Address</th>
              <th>Action</th>
              <th>Severity</th>
              <th>Country</th>
              <th>City</th>
              <th>Threat</th>
              <th>Blockchain Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="9" className="no-data">No threats found</td></tr>
            ) : (
              filtered.map((t, i) => (
                <tr key={t._id || i} className={t.severity === 'HIGH' ? 'row-high' : ''}>
                  <td>{i + 1}</td>
                  <td className="mono">{t.ip}</td>
                  <td><span className="action-badge">{t.action}</span></td>
                  <td>
                    <span className="sev-badge" style={{ background: SEV_COLOR[t.severity] }}>
                      {t.severity}
                    </span>
                  </td>
                  <td>{t.country || '—'}</td>
                  <td>{t.city || '—'}</td>
                  <td>{t.threat ? '⚠️ YES' : '✅ NO'}</td>
                  <td className="mono hash">{t.blockchainHash?.substring(0, 16)}...</td>
                  <td>{new Date(t.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="table-footer">Showing {filtered.length} of {threats.length} records</p>
    </div>
  );
}

export default ThreatTable;
