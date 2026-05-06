// routes/statsRoutes.js
const express = require('express');
const router  = express.Router();
const { getStats } = require('../controllers/statsController');

router.get('/', getStats);   // GET /api/stats

module.exports = router;
