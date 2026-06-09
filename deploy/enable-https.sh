#!/bin/bash
# Enable HTTPS on get-consult.com (skips DNS checks — run when apex points to this server)
set -euo pipefail

APEX="get-consult.com"
WWW="www.get-consult.com"
EMAIL="${CERTBOT_EMAIL:-contact@get-consult.com}"
IP="5.189.157.30"

echo "==> GET Consult — Enable HTTPS"
echo ""

echo "==> Firewall (allow 80 + 443)..."
if command -v ufw >/dev/null 2>&1; then
  ufw allow 80/tcp  >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
fi

echo "==> Nginx HTTP config..."
cp /tmp/nginx-get-consult.conf /etc/nginx/sites-available/get-consult
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult
nginx -t
systemctl reload nginx

echo "==> Certbot..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq certbot python3-certbot-nginx

echo "==> DNS from this server:"
echo "  ${APEX}: $(dig +short ${APEX} A 2>/dev/null | tr '\n' ' ')"
echo "  ${WWW}: $(dig +short ${WWW} A 2>/dev/null | tr '\n' ' ')"

DOMAINS=()
if dig +short "${APEX}" A 2>/dev/null | grep -qx "${IP}"; then
  DOMAINS+=("-d" "${APEX}")
fi
if dig +short "${WWW}" A 2>/dev/null | grep -qx "${IP}"; then
  DOMAINS+=("-d" "${WWW}")
fi

if [ ${#DOMAINS[@]} -eq 0 ]; then
  echo "ERROR: Neither ${APEX} nor ${WWW} points to ${IP} from this server."
  echo "Fix DNS at Bluehost, wait 10 minutes, run again."
  exit 1
fi

echo "==> Requesting certificate for: ${DOMAINS[*]}"
certbot --nginx \
  "${DOMAINS[@]}" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --redirect \
  --non-interactive

systemctl enable certbot.timer 2>/dev/null || true
systemctl start certbot.timer 2>/dev/null || true

echo ""
echo "=========================================="
echo "  HTTPS enabled!"
curl -sI "https://${APEX}" 2>/dev/null | head -5 || true
echo "=========================================="
