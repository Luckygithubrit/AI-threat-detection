// ============================================================
// models/Threat.js - MongoDB Schema for Threat Logs
// ============================================================

const mongoose = require('mongoose');

const ThreatSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login_attempt', 'port_scan', 'malware_activity', 'file_access', 'brute_force', 'ddos', 'unknown'],
    default: 'unknown'
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  threat: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  region: {
    type: String,
    default: 'Unknown'
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  blockchainHash: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Threat', ThreatSchema);
