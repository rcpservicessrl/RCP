"""
RCP Services — Health Check Script
Monitors all critical services and reports status.
Can be run as a cron job or triggered manually.

Services monitored:
  1. rcp.services (website reachability)
  2. Supabase DB (REST API ping)
  3. GCP Cloud Functions (rcpChat, rcpLead)
  4. n8n (if tunnel URL available)
  5. Odoo (if accessible)

Usage:
  python health_check.py

Environment variables (from .env):
  SUPABASE_URL, SUPABASE_KEY, N8N_TUNNEL_URL, ODOO_URL
"""

import os
import sys
import time
import json
from datetime import datetime, timezone

try:
    import requests
except ImportError:
    print("ERROR: 'requests' package required. Install with: pip install requests")
    sys.exit(1)

# ─── Configuration ───────────────────────────────────────────────────────────

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://wpfovxgbennpgydbellw.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'sb_publishable_wQHzaXkyhbfuOdDkMAWAKQ_VOE14bfO')
N8N_TUNNEL_URL = os.getenv('N8N_TUNNEL_URL', '')
ODOO_URL = os.getenv('ODOO_URL', 'https://rcp-services.odoo.com')
GCP_CHAT_URL = 'https://us-central1-rcp-services-cloud.cloudfunctions.net/rcpChat'
GCP_LEAD_URL = 'https://us-central1-rcp-services-cloud.cloudfunctions.net/rcpLead'
WEBSITE_URL = 'https://rcp.services'
WHATSAPP_NOTIFY = os.getenv('WHATSAPP_NOTIFY', '')  # Evolution API endpoint for alerts

TIMEOUT = 10  # seconds per request


# ─── Check Functions ─────────────────────────────────────────────────────────

def check_website():
    """Check if rcp.services is reachable and returns 200."""
    try:
        r = requests.get(WEBSITE_URL, timeout=TIMEOUT, allow_redirects=True)
        return {
            'service': 'Website (rcp.services)',
            'status': 'OK' if r.status_code == 200 else 'WARN',
            'code': r.status_code,
            'latency_ms': int(r.elapsed.total_seconds() * 1000),
            'detail': f'HTTP {r.status_code}'
        }
    except Exception as e:
        return {
            'service': 'Website (rcp.services)',
            'status': 'DOWN',
            'code': 0,
            'latency_ms': -1,
            'detail': str(e)
        }


def check_supabase():
    """Ping Supabase REST API by querying the roles table (public read)."""
    try:
        url = f"{SUPABASE_URL}/rest/v1/roles?select=slug&limit=1"
        headers = {'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'}
        r = requests.get(url, headers=headers, timeout=TIMEOUT)
        ok = r.status_code == 200 and isinstance(r.json(), list)
        return {
            'service': 'Supabase DB',
            'status': 'OK' if ok else 'WARN',
            'code': r.status_code,
            'latency_ms': int(r.elapsed.total_seconds() * 1000),
            'detail': f'{len(r.json())} row(s)' if ok else r.text[:100]
        }
    except Exception as e:
        return {
            'service': 'Supabase DB',
            'status': 'DOWN',
            'code': 0,
            'latency_ms': -1,
            'detail': str(e)
        }


def check_gcp_chat():
    """Check rcpChat Cloud Function with an OPTIONS preflight."""
    try:
        r = requests.options(GCP_CHAT_URL, timeout=TIMEOUT)
        return {
            'service': 'GCP rcpChat',
            'status': 'OK' if r.status_code == 204 else 'WARN',
            'code': r.status_code,
            'latency_ms': int(r.elapsed.total_seconds() * 1000),
            'detail': f'CORS preflight HTTP {r.status_code}'
        }
    except Exception as e:
        return {
            'service': 'GCP rcpChat',
            'status': 'DOWN',
            'code': 0,
            'latency_ms': -1,
            'detail': str(e)
        }


def check_gcp_lead():
    """Check rcpLead Cloud Function with an OPTIONS preflight."""
    try:
        r = requests.options(GCP_LEAD_URL, timeout=TIMEOUT)
        return {
            'service': 'GCP rcpLead',
            'status': 'OK' if r.status_code == 204 else 'WARN',
            'code': r.status_code,
            'latency_ms': int(r.elapsed.total_seconds() * 1000),
            'detail': f'CORS preflight HTTP {r.status_code}'
        }
    except Exception as e:
        return {
            'service': 'GCP rcpLead',
            'status': 'DOWN',
            'code': 0,
            'latency_ms': -1,
            'detail': str(e)
        }


def check_n8n():
    """Check n8n health endpoint (if tunnel URL is set)."""
    if not N8N_TUNNEL_URL:
        return {
            'service': 'n8n',
            'status': 'SKIP',
            'code': 0,
            'latency_ms': -1,
            'detail': 'N8N_TUNNEL_URL not configured'
        }
    try:
        url = f"{N8N_TUNNEL_URL.rstrip('/')}/healthz"
        r = requests.get(url, timeout=TIMEOUT)
        return {
            'service': 'n8n',
            'status': 'OK' if r.status_code == 200 else 'WARN',
            'code': r.status_code,
            'latency_ms': int(r.elapsed.total_seconds() * 1000),
            'detail': f'HTTP {r.status_code}'
        }
    except Exception as e:
        return {
            'service': 'n8n',
            'status': 'DOWN',
            'code': 0,
            'latency_ms': -1,
            'detail': str(e)
        }


def check_odoo():
    """Check Odoo online reachability."""
    try:
        r = requests.get(ODOO_URL, timeout=TIMEOUT, allow_redirects=True)
        return {
            'service': 'Odoo CRM',
            'status': 'OK' if r.status_code == 200 else 'WARN',
            'code': r.status_code,
            'latency_ms': int(r.elapsed.total_seconds() * 1000),
            'detail': f'HTTP {r.status_code}'
        }
    except Exception as e:
        return {
            'service': 'Odoo CRM',
            'status': 'DOWN',
            'code': 0,
            'latency_ms': -1,
            'detail': str(e)
        }


# ─── Main ────────────────────────────────────────────────────────────────────

def run_all_checks():
    """Execute all health checks and return results."""
    checks = [
        check_website,
        check_supabase,
        check_gcp_chat,
        check_gcp_lead,
        check_n8n,
        check_odoo,
    ]

    results = []
    for check in checks:
        result = check()
        results.append(result)

    return results


def format_report(results):
    """Format results as a readable report."""
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    lines = [
        f"═══ RCP SERVICES HEALTH CHECK ═══",
        f"Timestamp: {now}",
        f"{'─' * 50}",
    ]

    down_count = 0
    for r in results:
        icon = '✅' if r['status'] == 'OK' else '⚠️' if r['status'] == 'WARN' else '⏭️' if r['status'] == 'SKIP' else '❌'
        latency = f"{r['latency_ms']}ms" if r['latency_ms'] >= 0 else 'N/A'
        lines.append(f"  {icon} {r['service']:<25} {r['status']:<5} {latency:<8} {r['detail']}")
        if r['status'] == 'DOWN':
            down_count += 1

    lines.append(f"{'─' * 50}")
    overall = '🟢 ALL SYSTEMS OPERATIONAL' if down_count == 0 else f'🔴 {down_count} SERVICE(S) DOWN'
    lines.append(f"  {overall}")
    lines.append("")

    return '\n'.join(lines), down_count


def notify_whatsapp(report, down_count):
    """Send alert via WhatsApp (Evolution API) if services are down."""
    if not WHATSAPP_NOTIFY or down_count == 0:
        return

    try:
        # Evolution API format (adjust to your instance)
        payload = {
            "number": "18298068092",
            "text": f"🚨 *RCP Health Alert*\n\n{report}"
        }
        requests.post(
            WHATSAPP_NOTIFY,
            json=payload,
            timeout=10
        )
    except Exception as e:
        print(f"[WARN] WhatsApp notification failed: {e}")


if __name__ == '__main__':
    print("Running health checks...\n")
    results = run_all_checks()
    report, down_count = format_report(results)
    print(report)

    # Notify if anything is down
    notify_whatsapp(report, down_count)

    # Exit code for cron/CI usage
    sys.exit(1 if down_count > 0 else 0)
