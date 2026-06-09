#!/bin/bash
# Pull latest code from GitHub and reload the live site
set -euo pipefail

SITE_DIR="/var/www/get-consult"
BRANCH="${BRANCH:-main}"

if [ ! -d "$SITE_DIR/.git" ]; then
  echo "ERROR: $SITE_DIR is not a git repository."
  echo "Run once: bash /var/www/get-consult/deploy/setup-git-deploy.sh"
  exit 1
fi

echo "==> Pulling origin/$BRANCH into $SITE_DIR..."
git -C "$SITE_DIR" fetch origin "$BRANCH"
git -C "$SITE_DIR" checkout "$BRANCH"
git -C "$SITE_DIR" reset --hard "origin/$BRANCH"

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "ERROR: index.html missing after pull."
  exit 1
fi

chmod +x "$SITE_DIR"/deploy/*.sh 2>/dev/null || true
chown -R www-data:www-data "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

echo "==> Deployed commit:"
git -C "$SITE_DIR" log -1 --oneline
echo ""
VERIFY_URL="${VERIFY_URL:-https://get-consult.com}"
curl -sfI "$VERIFY_URL" 2>/dev/null | head -3 || curl -sfI http://5.189.157.30/ | head -3 || true
echo "Done — site updated from GitHub."
