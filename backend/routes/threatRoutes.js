// ============================================================
// routes/threatRoutes.js
// ============================================================

const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/threatController');

router.post('/',        ctrl.receiveTelemetry);   // POST /api/telemetry
router.get('/',         ctrl.getAllThreats);       // GET  /api/threats
router.get('/:id',      ctrl.getThreatById);      // GET  /api/threats/:id

module.exports = router;
