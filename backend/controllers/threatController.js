// ============================================================
// controllers/threatController.js
// Handles telemetry ingestion, AI analysis, DB storage, alerts
// ============================================================

const axios   = require('axios');
const geoip   = require('geoip-lite');
const Threat  = require('../models/Threat');
const { generateHash } = require('../../blockchain/blockchain');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:7000/analyze';

// ── POST /api/telemetry ──────────────────────────────────────
// Receives telemetry, calls AI, saves to DB, emits socket alert
exports.receiveTelemetry = async (req, res) => {
  try {
    const { ip, action } = req.body;

    if (!ip || !action) {
      return res.status(400).json({ error: 'ip and action are required' });
    }

    // ── 1. Call Python AI Engine ─────────────────────────────
    let severity = 'LOW';
    let isThreat = false;

    try {
      const aiResponse = await axios.post(AI_ENGINE_URL, { ip, action }, { timeout: 5000 });
      severity = aiResponse.data.severity || 'LOW';
      isThreat = aiResponse.data.threat    || false;
    } catch (aiError) {
      // Fallback rule-based classification if AI engine is down
      console.warn('⚠️  AI Engine unreachable, using rule-based fallback');
      const highActions = ['port_scan', 'malware_activity', 'brute_force', 'ddos'];
      const medActions  = ['login_attempt'];
      if (highActions.includes(action)) { severity = 'HIGH';   isThreat = true;  }
      else if (medActions.includes(action)) { severity = 'MEDIUM'; isThreat = true; }
      else { severity = 'LOW'; isThreat = false; }
    }

    // ── 2. GeoIP Lookup ──────────────────────────────────────
    const geo = geoip.lookup(ip) || {};
    const country   = geo.country  || 'Unknown';
    const region    = geo.region   || 'Unknown';
    const city      = geo.city     || 'Unknown';
    const latitude  = geo.ll ? geo.ll[0] : 0;
    const longitude = geo.ll ? geo.ll[1] : 0;

    // ── 3. Blockchain Hash ───────────────────────────────────
    const logData = JSON.stringify({ ip, action, severity, timestamp: new Date().toISOString() });
    const blockchainHash = generateHash(logData);

    // ── 4. Save to MongoDB ───────────────────────────────────
    const threat = new Threat({
      ip, action, severity,
      threat: isThreat,
      country, region, city,
      latitude, longitude,
      blockchainHash
    });
    await threat.save();

    // ── 5. Emit Real-Time Alert via Socket.IO ─────────────────
    const io = req.app.get('io');
    if (io && isThreat) {
      io.emit('new_threat', {
        id:        threat._id,
        ip, action, severity,
        country, city,
        timestamp: threat.timestamp,
        blockchainHash
      });
    }

    console.log(`[${severity}] Threat from ${ip} - Action: ${action}`);

    return res.status(201).json({
      success: true,
      severity,
      threat: isThreat,
      country,
      city,
      blockchainHash,
      id: threat._id
    });

  } catch (err) {
    console.error('❌ Error in receiveTelemetry:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── GET /api/threats ─────────────────────────────────────────
// Returns all stored threats (latest first)
exports.getAllThreats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const threats = await Threat.find().sort({ timestamp: -1 }).limit(limit);
    return res.json(threats);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ── GET /api/threats/:id ──────────────────────────────────────
exports.getThreatById = async (req, res) => {
  try {
    const threat = await Threat.findById(req.params.id);
    if (!threat) return res.status(404).json({ error: 'Threat not found' });
    return res.json(threat);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
