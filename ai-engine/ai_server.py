# ============================================================
# ai_server.py - Python Flask AI Threat Detection Engine
# Runs on http://127.0.0.1:7000
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import json

app = Flask(__name__)
CORS(app)

# ── Label Encoders ───────────────────────────────────────────
action_encoder = LabelEncoder()
severity_encoder = LabelEncoder()

# ── Training Data ────────────────────────────────────────────
# Format: [action_encoded, login_attempts, port_scans, malware_count, file_accesses]
# Label : severity (0=LOW, 1=MEDIUM, 2=HIGH)

ACTIONS = [
    'login_attempt', 'port_scan', 'malware_activity',
    'file_access', 'brute_force', 'ddos', 'unknown'
]
action_encoder.fit(ACTIONS)

TRAINING_DATA = [
    # [action_idx, login_attempts, port_scans, malware_count, file_accesses] -> severity
    [ACTIONS.index('login_attempt'),     5, 0, 0, 2],   # LOW
    [ACTIONS.index('login_attempt'),    20, 0, 0, 0],   # MEDIUM
    [ACTIONS.index('login_attempt'),   100, 0, 0, 0],   # HIGH (brute force pattern)
    [ACTIONS.index('file_access'),       0, 0, 0, 3],   # LOW
    [ACTIONS.index('file_access'),       0, 0, 0, 50],  # MEDIUM
    [ACTIONS.index('port_scan'),         0, 1, 0, 0],   # HIGH
    [ACTIONS.index('port_scan'),         0, 5, 0, 0],   # HIGH
    [ACTIONS.index('malware_activity'),  0, 0, 1, 0],   # HIGH
    [ACTIONS.index('malware_activity'),  0, 0, 3, 0],   # HIGH
    [ACTIONS.index('brute_force'),      50, 0, 0, 0],   # HIGH
    [ACTIONS.index('ddos'),              0, 10, 0, 0],  # HIGH
    [ACTIONS.index('unknown'),           1, 0, 0, 1],   # LOW
]

LABELS = [0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 0]
# 0=LOW, 1=MEDIUM, 2=HIGH

SEVERITY_MAP = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}

# ── Train the Model ──────────────────────────────────────────
X = np.array(TRAINING_DATA)
y = np.array(LABELS)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

print("✅ ML Model trained successfully")
print(f"   Actions: {ACTIONS}")
print(f"   Training samples: {len(X)}")


# ── Helper: Rule-based feature extraction ────────────────────
def extract_features(data):
    action = data.get('action', 'unknown')
    if action not in ACTIONS:
        action = 'unknown'
    action_idx      = ACTIONS.index(action)
    login_attempts  = data.get('login_attempts',  1 if action == 'login_attempt'   else 0)
    port_scans      = data.get('port_scans',      1 if action == 'port_scan'        else 0)
    malware_count   = data.get('malware_count',   1 if action == 'malware_activity' else 0)
    file_accesses   = data.get('file_accesses',   1 if action == 'file_access'      else 0)
    return [action_idx, login_attempts, port_scans, malware_count, file_accesses]


# ── POST /analyze ────────────────────────────────────────────
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        ip     = data.get('ip', '0.0.0.0')
        action = data.get('action', 'unknown')

        features = extract_features(data)
        X_input  = np.array([features])

        prediction = model.predict(X_input)[0]
        confidence = float(max(model.predict_proba(X_input)[0]))

        severity  = SEVERITY_MAP[prediction]
        is_threat = severity in ['MEDIUM', 'HIGH']

        print(f"[ANALYZE] IP={ip} Action={action} → {severity} (conf={confidence:.2f})")

        return jsonify({
            'ip':         ip,
            'action':     action,
            'severity':   severity,
            'threat':     is_threat,
            'confidence': round(confidence, 4),
            'features':   features
        })

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return jsonify({'error': str(e)}), 500


# ── GET /health ──────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Engine Running', 'model': 'RandomForestClassifier'})


# ── GET /model-info ──────────────────────────────────────────
@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        'algorithm':       'Random Forest Classifier',
        'n_estimators':    100,
        'training_samples': len(X),
        'features':        ['action_idx', 'login_attempts', 'port_scans', 'malware_count', 'file_accesses'],
        'classes':         ['LOW', 'MEDIUM', 'HIGH']
    })


if __name__ == '__main__':
    print("🤖 Starting AI Threat Detection Engine on port 7000...")
    app.run(host='127.0.0.1', port=7000, debug=False)


# by lucky