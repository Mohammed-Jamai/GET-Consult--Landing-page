#!/bin/bash
# Install HTTPS for get-consult.com only (when www DNS is still propagating)
set -euo pipefail

APEX="get-consult.com"
EMAIL="${CERTBOT_EMAIL:-contact@get-consult.com}"

echo "==> GET Consult — HTTPS (apex only: ${APEX})"
echo ""

echo "==> Updating nginx HTTP config..."
cp /tmp/nginx-get-consult.conf /etc/nginx/sites-available/get-consult
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult
nginx -t
systemctl reload nginx

echo ""
echo "==> Installing certbot (if needed)..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq certbot python3-certbot-nginx

echo ""
echo "==> Requesting SSL certificate for ${APEX}..."
certbot --nginx \
  -d "$APEX" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --redirect \
  --non-interactive

systemctl enable certbot.timer 2>/dev/null || true
systemctl start certbot.timer 2>/dev/null || true

echo ""
echo "=========================================="
echo "  HTTPS is live at https://${APEX}"
echo "  Re-run ssl-setup.sh later to add www"
echo "=========================================="
curl -sI "https://${APEX}" | head -6
