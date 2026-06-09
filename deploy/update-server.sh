#!/bin/bash
# Quick site update — re-extract tarball only (nginx unchanged)
set -euo pipefail

SITE_DIR="/var/www/get-consult"
ARCHIVE="/tmp/get-consult-site.tar.gz"

if [ ! -f "$ARCHIVE" ]; then
  echo "ERROR: $ARCHIVE not found."
  exit 1
fi

echo "==> Updating $SITE_DIR..."
mkdir -p "$SITE_DIR"
rm -rf "${SITE_DIR:?}/"*
tar -xzf "$ARCHIVE" -C "$SITE_DIR"

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "ERROR: index.html missing after extract."
  exit 1
fi

chown -R www-data:www-data "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

echo "==> Updated files:"
ls -la "$SITE_DIR"
echo ""
curl -sI http://127.0.0.1/ | head -3
echo "Done — site updated."
