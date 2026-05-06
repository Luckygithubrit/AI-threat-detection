# 🛡️ AI-Driven Real-Time Cyber Threat Detection & Alert System

## Project Structure

```
cyber-threat-system/
├── backend/                  ← Node.js + Express + Socket.IO
│   ├── server.js             ← Main entry point
│   ├── models/Threat.js      ← MongoDB schema
│   ├── controllers/
│   │   ├── threatController.js
│   │   └── statsController.js
│   ├── routes/
│   │   ├── threatRoutes.js
│   │   └── statsRoutes.js
│   ├── .env
│   └── package.json
│
├── ai-engine/                ← Python Flask + Scikit-Learn
│   ├── ai_server.py          ← ML threat classifier
│   └── requirements.txt
│
├── blockchain/               ← SHA-256 logging module
│   └── blockchain.js
│
├── telemetry-simulator/      ← Test attack simulator
│   └── telemetry_simulator.py
│
└── frontend/                 ← React.js SOC Dashboard
    ├── public/index.html
    ├── package.json
    └── src/
        ├── App.js
        ├── App.css
        ├── index.js
        ├── pages/Dashboard.js
        └── components/
            ├── StatCards.js
            ├── ThreatTable.js
            ├── ThreatCharts.js
            ├── LiveAlerts.js
            ├── ThreatMap.js
            └── TestPanel.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB (running locally on port 27017)

---

### Step 1: Start MongoDB
```bash
mongod
```

---

### Step 2: Start AI Engine (Python Flask)
```bash
cd ai-engine
pip install -r requirements.txt
python ai_server.py
# Runs on http://127.0.0.1:7000
```

---

### Step 3: Start Backend (Node.js)
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
```

---

### Step 4: Start Frontend (React)
```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

---

## 🧪 Testing the System

### Option A: Use the Dashboard Test Panel
Open http://localhost:3000 → Use the "Send Test Telemetry" panel on the right.

### Option B: Use PowerShell / curl
```powershell
# Windows PowerShell
Invoke-RestMethod -Uri http://localhost:5000/api/telemetry `
  -Method POST `
  -Body '{"ip":"45.33.32.156","action":"port_scan"}' `
  -ContentType "application/json"
```

```bash
# Linux / Mac
curl -X POST http://localhost:5000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{"ip":"45.33.32.156","action":"malware_activity"}'
```

### Option C: Run Telemetry Simulator
```bash
cd telemetry-simulator
python telemetry_simulator.py 30 1
# Sends 30 events, 1 second apart
```

---

## 🔌 API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | /api/telemetry      | Submit new telemetry     |
| GET    | /api/threats        | Get all threat logs      |
| GET    | /api/threats/:id    | Get single threat        |
| GET    | /api/stats          | Get dashboard statistics |

---

## 🤖 AI Engine Endpoints

| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| POST   | /analyze       | Analyze a telemetry event |
| GET    | /health        | Health check          |
| GET    | /model-info    | ML model details      |

---

## 🎯 Action Types & Expected Severity

| Action            | Expected Severity |
|-------------------|-------------------|
| login_attempt     | LOW / MEDIUM      |
| file_access       | LOW / MEDIUM      |
| port_scan         | HIGH              |
| malware_activity  | HIGH              |
| brute_force       | HIGH              |
| ddos              | HIGH              |

---

## 🏗️ Architecture

```
Telemetry Source
      ↓ (POST /api/telemetry)
Node.js Backend (port 5000)
      ↓ (POST /analyze)
Python AI Engine (port 7000)  ← RandomForestClassifier
      ↓ result
Node.js saves to MongoDB
      ↓ (Socket.IO emit)
React Dashboard (port 3000)  ← Live alerts appear instantly
```

---

## 🔗 Blockchain Logging
Each threat log gets a SHA-256 hash computed as:
```
hash = SHA256(ip + action + severity + timestamp)
```
This hash is stored in MongoDB and displayed in the dashboard,
making every log entry tamper-evident.
