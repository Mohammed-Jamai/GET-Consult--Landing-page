#!/bin/bash
# One-time: clone GitHub repo into /var/www/get-consult for pull-based updates
set -euo pipefail

REPO_URL="${1:-https://github.com/Mohammed-Jamai/GET-Consult--Landing-page.git}"
SITE_DIR="/var/www/get-consult"
BRANCH="${BRANCH:-main}"

echo "==> GET Consult — Git deploy setup"
echo "    Repo:   $REPO_URL"
echo "    Branch: $BRANCH"
echo "    Path:   $SITE_DIR"
echo ""

export DEBIAN_FRONTEND=noninteractive
if ! command -v git >/dev/null 2>&1; then
  echo "==> Installing git..."
  apt-get update -qq
  apt-get install -y -qq git
fi

mkdir -p "$SITE_DIR"

if [ -d "$SITE_DIR/.git" ]; then
  echo "==> Existing git repo — fetching latest..."
  git -C "$SITE_DIR" fetch origin "$BRANCH"
  git -C "$SITE_DIR" checkout "$BRANCH"
  git -C "$SITE_DIR" reset --hard "origin/$BRANCH"
else
  echo "==> Cloning repository..."
  rm -rf "${SITE_DIR:?}/"*
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$SITE_DIR"
fi

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "ERROR: index.html missing after clone."
  exit 1
fi

chmod +x "$SITE_DIR"/deploy/*.sh 2>/dev/null || true
chown -R www-data:www-data "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

if [ -f "$SITE_DIR/deploy/nginx-get-consult.conf" ]; then
  echo "==> Updating nginx config..."
  cp "$SITE_DIR/deploy/nginx-get-consult.conf" /etc/nginx/sites-available/get-consult
  rm -f /etc/nginx/sites-enabled/*
  ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult
  nginx -t
  systemctl reload nginx
fi

echo ""
echo "=========================================="
echo "  Git deploy ready."
echo ""
echo "  Future updates on the server:"
echo "    bash $SITE_DIR/deploy/pull-update.sh"
echo "=========================================="
curl -sI http://127.0.0.1/ | head -5
