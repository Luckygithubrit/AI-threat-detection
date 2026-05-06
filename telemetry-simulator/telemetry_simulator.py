# ============================================================
# telemetry_simulator.py
# Simulates cyber attacks by sending telemetry to backend
# ============================================================

import requests
import random
import time
import json

BACKEND_URL = 'http://localhost:5000/api/telemetry'

# Pool of simulated IPs
IPS = [
    '192.168.1.100', '10.0.0.50', '172.16.0.22',
    '45.33.32.156',  '8.8.8.8',   '1.1.1.1',
    '203.0.113.5',   '198.51.100.25', '185.220.101.45'
]

# Action types and their weights (probability)
ACTIONS = {
    'login_attempt':     0.30,
    'port_scan':         0.20,
    'malware_activity':  0.15,
    'file_access':       0.20,
    'brute_force':       0.10,
    'ddos':              0.05
}

def pick_action():
    actions = list(ACTIONS.keys())
    weights = list(ACTIONS.values())
    return random.choices(actions, weights=weights, k=1)[0]

def send_telemetry(ip, action, extra=None):
    payload = {'ip': ip, 'action': action}
    if extra:
        payload.update(extra)
    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=5)
        data = response.json()
        severity = data.get('severity', 'UNKNOWN')
        print(f"  [{severity:6}] {ip:20} → {action}")
        return data
    except Exception as e:
        print(f"  [ERROR ] Failed to send: {e}")
        return None

def run_simulation(total_events=50, delay=1.0):
    print("=" * 60)
    print("  🎯 Cyber Threat Telemetry Simulator")
    print(f"  Sending {total_events} events to {BACKEND_URL}")
    print("=" * 60)

    for i in range(1, total_events + 1):
        ip     = random.choice(IPS)
        action = pick_action()

        # Add extra context for specific actions
        extra = {}
        if action == 'login_attempt':
            extra['login_attempts'] = random.randint(1, 150)
        elif action == 'port_scan':
            extra['port_scans'] = random.randint(1, 20)
        elif action == 'malware_activity':
            extra['malware_count'] = random.randint(1, 5)
        elif action == 'file_access':
            extra['file_accesses'] = random.randint(1, 100)

        print(f"\n[{i:03}/{total_events}] Sending event...")
        send_telemetry(ip, action, extra)
        time.sleep(delay)

    print("\n✅ Simulation complete!")

if __name__ == '__main__':
    import sys
    total  = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    delay  = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
    run_simulation(total_events=total, delay=delay)
