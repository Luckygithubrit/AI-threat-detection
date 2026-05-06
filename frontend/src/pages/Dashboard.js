// ============================================================
// src/pages/Dashboard.js - Main Dashboard Page
// ============================================================

import React from 'react';
import StatCards    from '../components/StatCards';
import ThreatTable  from '../components/ThreatTable';
import ThreatCharts from '../components/ThreatCharts';
import LiveAlerts   from '../components/LiveAlerts';
import ThreatMap    from '../components/ThreatMap';
import TestPanel    from '../components/TestPanel';

function Dashboard({ threats, stats, connected, liveAlerts, onDismissAlert, onRefresh }) {
  return (
    <div className="dashboard">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="dash-header">
        <div className="header-left">
          <span className="header-icon">🛡️</span>
          <div>
            <h1>CyberSOC Dashboard</h1>
            <p>AI-Driven Real-Time Cyber Threat Detection System</p>
          </div>
        </div>
        <div className="header-right">
          <div className={`status-badge ${connected ? 'online' : 'offline'}`}>
            <span className="dot"></span>
            {connected ? 'LIVE' : 'OFFLINE'}
          </div>
          <button className="refresh-btn" onClick={onRefresh}>⟳ Refresh</button>
        </div>
      </header>

      {/* ── Live Alert Notifications ─────────────────────────── */}
      <LiveAlerts alerts={liveAlerts} onDismiss={onDismissAlert} />

      {/* ── Stat Cards ───────────────────────────────────────── */}
      <StatCards stats={stats} />

      {/* ── Charts Row ───────────────────────────────────────── */}
      <div className="row">
        <div className="col-2">
          <ThreatCharts stats={stats} />
        </div>
        <div className="col-1">
          <TestPanel onRefresh={onRefresh} />
        </div>
      </div>

      {/* ── Map ──────────────────────────────────────────────── */}
      <ThreatMap threats={threats} />

      {/* ── Threat Table ─────────────────────────────────────── */}
      <ThreatTable threats={threats} />

    </div>
  );
}

export default Dashboard;
