#!/bin/bash
set -euo pipefail

SITE_DIR="/var/www/get-consult"
ARCHIVE="${1:-/tmp/get-consult-site.tar.gz}"

echo "==> Installing nginx if needed..."
export DEBIAN_FRONTEND=noninteractive
if ! command -v nginx >/dev/null 2>&1; then
  apt-get update -qq
  apt-get install -y -qq nginx
fi

echo "==> Deploying site files..."
mkdir -p "$SITE_DIR"
rm -rf "${SITE_DIR:?}/"*
tar -xzf "$ARCHIVE" -C "$SITE_DIR"

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "ERROR: index.html not found after extract."
  ls -laR "$SITE_DIR"
  exit 1
fi

chown -R www-data:www-data "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

echo "==> Configuring nginx..."
cp /tmp/nginx-get-consult.conf /etc/nginx/sites-available/get-consult
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult

nginx -t
systemctl enable nginx
systemctl restart nginx

echo "==> Done. Site live at http://5.189.157.30"
curl -sI http://127.0.0.1/ | head -8
