// src/components/StatCards.js
import React from 'react';

function StatCards({ stats }) {
  if (!stats) return <div className="stat-cards"><div className="loading">Loading stats...</div></div>;

  const cards = [
    { label: 'Total Threats',    value: stats.total,   icon: '🎯', cls: 'card-total'  },
    { label: 'High Severity',    value: stats.high,    icon: '🔴', cls: 'card-high'   },
    { label: 'Medium Severity',  value: stats.medium,  icon: '🟠', cls: 'card-medium' },
    { label: 'Low Severity',     value: stats.low,     icon: '🟡', cls: 'card-low'    },
    { label: 'Last 24 Hours',    value: stats.last24h, icon: '⏱️', cls: 'card-24h'   },
  ];

  return (
    <div className="stat-cards">
      {cards.map((card, i) => (
        <div key={i} className={`stat-card ${card.cls}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-value">{card.value ?? 0}</div>
          <div className="card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

export default StatCards;
