// ============================================================
// src/App.js - Root Component
// ============================================================

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import './App.css';

const BACKEND = 'http://localhost:5000';

function App() {
  const [threats,    setThreats]    = useState([]);
  const [stats,      setStats]      = useState(null);
  const [connected,  setConnected]  = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);

  // ── Fetch initial data ─────────────────────────────────────
  useEffect(() => {
    fetchThreats();
    fetchStats();
  }, []);

  // ── Socket.IO real-time connection ─────────────────────────
  useEffect(() => {
    const socket = io(BACKEND);

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    socket.on('new_threat', (threat) => {
      console.log('🚨 New threat received:', threat);
      // Prepend new threat to list
      setThreats(prev => [threat, ...prev].slice(0, 200));
      // Add to live alerts
      setLiveAlerts(prev => [{ ...threat, id: Date.now() }, ...prev].slice(0, 5));
      // Re-fetch stats
      fetchStats();
    });

    return () => socket.disconnect();
  }, []);

  const fetchThreats = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/threats?limit=100`);
      setThreats(res.data);
    } catch (err) {
      console.error('Failed to fetch threats:', err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err.message);
    }
  };

  const dismissAlert = (id) => {
    setLiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="App">
      <Dashboard
        threats={threats}
        stats={stats}
        connected={connected}
        liveAlerts={liveAlerts}
        onDismissAlert={dismissAlert}
        onRefresh={() => { fetchThreats(); fetchStats(); }}
      />
    </div>
  );
}

export default App;
