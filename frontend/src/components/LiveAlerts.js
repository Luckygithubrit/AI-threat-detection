// src/components/LiveAlerts.js
import React from 'react';

const SEV_COLOR = { HIGH: '#ef4444', MEDIUM: '#f97316', LOW: '#22c55e' };

function LiveAlerts({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="live-alerts">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="alert-toast"
          style={{ borderLeft: `4px solid ${SEV_COLOR[alert.severity] || '#6366f1'}` }}
        >
          <div className="alert-content">
            <span className="alert-sev" style={{ color: SEV_COLOR[alert.severity] }}>
              🚨 {alert.severity} THREAT
            </span>
            <span className="alert-detail">
              IP: <strong>{alert.ip}</strong> — {alert.action?.replace(/_/g, ' ').toUpperCase()}
            </span>
            {alert.city && alert.city !== 'Unknown' && (
              <span className="alert-geo">📍 {alert.city}, {alert.country}</span>
            )}
          </div>
          <button className="alert-dismiss" onClick={() => onDismiss(alert.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

export default LiveAlerts;
