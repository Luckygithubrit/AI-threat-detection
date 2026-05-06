// src/components/TestPanel.js
// Lets you send test telemetry directly from the dashboard
import React, { useState } from 'react';
import axios from 'axios';

const ACTIONS = ['login_attempt','port_scan','malware_activity','file_access','brute_force','ddos'];
const BACKEND  = 'https://ai-threat-detection-c4p3.onrender.com';

function TestPanel({ onRefresh }) {
  const [ip,      setIp]      = useState('8.8.8.8');
  const [action,  setAction]  = useState('port_scan');
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const sendTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${BACKEND}/api/telemetry`, { ip, action });
      setResult(res.data);
      onRefresh();
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  const sevColor = { HIGH: '#ef4444', MEDIUM: '#f97316', LOW: '#22c55e' };

  return (
    <div className="panel">
      <h2>🧪 Send Test Telemetry</h2>
      <p className="panel-sub">Simulate an attack event manually</p>

      <div className="test-form">
        <label>IP Address</label>
        <input
          className="test-input"
          value={ip}
          onChange={e => setIp(e.target.value)}
          placeholder="e.g. 8.8.8.8"
        />

        <label>Action Type</label>
        <select className="test-input" value={action} onChange={e => setAction(e.target.value)}>
          {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <button className="send-btn" onClick={sendTest} disabled={loading}>
          {loading ? '⏳ Analyzing...' : '🚀 Send Telemetry'}
        </button>
      </div>

      {result && (
        <div className="test-result" style={{ borderColor: sevColor[result.severity] || '#6366f1' }}>
          {result.error ? (
            <p className="result-error">❌ {result.error}</p>
          ) : (
            <>
              <div className="result-sev" style={{ color: sevColor[result.severity] }}>
                {result.severity} {result.threat ? '⚠️ THREAT' : '✅ SAFE'}
              </div>
              <p>📍 {result.city || '?'}, {result.country || '?'}</p>
              <p className="mono" style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                🔗 Hash: {result.blockchainHash?.substring(0, 32)}...
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TestPanel;
