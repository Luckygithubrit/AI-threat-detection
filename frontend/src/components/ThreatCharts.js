// src/components/ThreatCharts.js
import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const SEV_COLORS = { HIGH: '#ef4444', MEDIUM: '#f97316', LOW: '#22c55e' };
const BAR_COLOR  = '#6366f1';

function ThreatCharts({ stats }) {
  if (!stats) return <div className="panel"><p className="loading">Loading charts...</p></div>;

  // Severity pie data
  const pieData = [
    { name: 'HIGH',   value: stats.high   || 0 },
    { name: 'MEDIUM', value: stats.medium || 0 },
    { name: 'LOW',    value: stats.low    || 0 },
  ].filter(d => d.value > 0);

  // Action bar data
  const barData = (stats.actionStats || []).map(a => ({
    name:  a._id,
    count: a.count
  }));

  return (
    <div className="panel">
      <h2>📊 Threat Analytics</h2>
      <div className="charts-row">

        {/* Severity Pie */}
        <div className="chart-box">
          <h3>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={SEV_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Action Bar Chart */}
        <div className="chart-box">
          <h3>Threats by Action Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
              <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default ThreatCharts;
