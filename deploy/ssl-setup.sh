#!/bin/bash
set -euo pipefail

DOMAIN="www.get-consult.com"
APEX="get-consult.com"
EMAIL="${CERTBOT_EMAIL:-contact@get-consult.com}"
IP="5.189.157.30"

echo "==> GET Consult — HTTPS setup for ${DOMAIN}"
echo ""

echo "==> Checking DNS (must point to ${IP})..."
dns_ok=true
for host in "$DOMAIN" "$APEX"; do
  mapfile -t records < <(dig +short "$host" A 2>/dev/null | grep -E '^[0-9]+\.' || true)
  if [ ${#records[@]} -eq 0 ]; then
    echo "  FAIL ${host} -> no A record"
    dns_ok=false
    continue
  fi
  echo "  ${host} A records: ${records[*]}"
  if printf '%s\n' "${records[@]}" | grep -qx "$IP"; then
    if [ "${#records[@]}" -eq 1 ] && [ "${records[0]}" = "$IP" ]; then
      echo "  OK  ${host} -> ${IP} only"
    else
      echo "  WARN ${host} includes ${IP} but also old records — remove them at registrar."
      dns_ok=false
    fi
  else
    echo "  FAIL ${host} -> missing ${IP}"
    dns_ok=false
  fi
done
if [ "$dns_ok" = false ]; then
  apex_records=$(dig +short "$APEX" A 2>/dev/null | grep -E '^[0-9]+\.' || true)
  if [ "$apex_records" = "$IP" ]; then
    echo ""
    echo "  WARN www DNS not ready — installing SSL for ${APEX} only."
    echo "  Run this script again later to add www."
    echo ""
    exec bash /tmp/ssl-setup-apex.sh
  fi
  echo ""
  echo "Fix DNS at your registrar:"
  echo "  DELETE all A records pointing to 103.169.142.0 (old host)"
  echo "  Type A   Name @     Value ${IP}   (only this)"
  echo "  Type A   Name www   Value ${IP}   (only this)"
  echo ""
  echo "Or run: bash /tmp/ssl-setup-apex.sh  (apex only)"
  echo "Wait 5–30 minutes, then run this script again."
  exit 1
fi

echo ""
echo "==> Updating nginx HTTP config..."
cp /tmp/nginx-get-consult.conf /etc/nginx/sites-available/get-consult
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult
nginx -t
systemctl reload nginx

echo ""
echo "==> Installing certbot..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq certbot python3-certbot-nginx

echo ""
echo "==> Requesting SSL certificate..."
certbot --nginx \
  -d "$DOMAIN" \
  -d "$APEX" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --redirect \
  --non-interactive

echo ""
echo "==> Redirecting ${APEX} -> https://${DOMAIN}..."
bash /tmp/nginx-ssl-redirect.sh

echo ""
echo "==> Testing renewal timer..."
systemctl enable certbot.timer 2>/dev/null || true
systemctl start certbot.timer 2>/dev/null || true

echo ""
echo "=========================================="
echo "  HTTPS is live!"
echo "  https://${DOMAIN}"
echo "  https://${APEX}  (redirects to www)"
echo "=========================================="
curl -sI "https://${DOMAIN}" | head -6
