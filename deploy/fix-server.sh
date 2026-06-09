#!/bin/bash
set -euo pipefail

SITE_DIR="/var/www/get-consult"
ARCHIVE="/tmp/get-consult-site.tar.gz"

echo "==> Checking archive..."
if [ ! -f "$ARCHIVE" ]; then
  echo "ERROR: $ARCHIVE not found. Upload it first with scp."
  exit 1
fi

echo "==> Clean deploy to $SITE_DIR..."
mkdir -p "$SITE_DIR"
rm -rf "${SITE_DIR:?}/"*
tar -xzf "$ARCHIVE" -C "$SITE_DIR"
mkdir -p "$SITE_DIR/api"

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "ERROR: index.html missing after extract. Contents:"
  ls -laR "$SITE_DIR"
  exit 1
fi

echo "==> Files deployed:"
ls -la "$SITE_DIR"

chown -R www-data:www-data "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

echo "==> Configuring nginx (single site)..."
cp /tmp/nginx-get-consult.conf /etc/nginx/sites-available/get-consult
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult

nginx -t
systemctl restart nginx

echo "==> Verify:"
curl -sI http://127.0.0.1/ | head -8
echo ""
echo "Site should be live at http://5.189.157.30"
