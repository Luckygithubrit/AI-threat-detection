// ============================================================
// server.js - Main Backend Entry Point
// AI-Driven Cyber Threat Detection System
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const threatRoutes = require('./routes/threatRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const httpServer = createServer(app);

// ── Socket.IO Setup ──────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://ai-threat-detection-sigma.vercel.app'
    ],
    methods: ['GET', 'POST']
  }
});

// Make io accessible to controllers
app.set('io', io);

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-threat-detection-sigma.vercel.app'
  ],
  methods: ['GET', 'POST']
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use('/api/telemetry', threatRoutes);
app.use('/api/threats',   threatRoutes);
app.use('/api/stats',     statsRoutes);

// ── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    status: 'Cyber Threat Detection System Running', 
    time: new Date() 
  });
});

// ── MongoDB Connection ───────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cyberthreat';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Socket.IO Events ─────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('📡 Dashboard client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('📴 Dashboard client disconnected:', socket.id);
  });
});