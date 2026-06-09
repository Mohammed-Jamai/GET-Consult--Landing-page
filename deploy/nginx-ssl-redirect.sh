#!/bin/bash
# Redirect bare domain to www (HTTPS) — applied after certbot
set -euo pipefail

DOMAIN="www.get-consult.com"
APEX="get-consult.com"
CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

if [ ! -f "$CERT" ]; then
  # certbot may use combined cert dir name
  CERT="/etc/letsencrypt/live/${APEX}/fullchain.pem"
  KEY="/etc/letsencrypt/live/${APEX}/privkey.pem"
fi

if [ ! -f "$CERT" ]; then
  echo "SSL certificates not found. Run ssl-setup.sh first."
  exit 1
fi

cat > /etc/nginx/sites-available/get-consult-redirect <<EOF
# Redirect apex to www
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${APEX};

    ssl_certificate ${CERT};
    ssl_certificate_key ${KEY};
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://${DOMAIN}\$request_uri;
}
EOF

ln -sf /etc/nginx/sites-available/get-consult-redirect /etc/nginx/sites-enabled/get-consult-redirect

# Ensure main SSL block uses www as primary server_name
SSL_CONF="/etc/nginx/sites-enabled/get-consult-le-ssl.conf"
if [ -f "$SSL_CONF" ]; then
  sed -i "s/server_name ${APEX} www.${DOMAIN};/server_name ${DOMAIN};/" "$SSL_CONF" 2>/dev/null || true
  sed -i "s/server_name www.${DOMAIN} ${APEX};/server_name ${DOMAIN};/" "$SSL_CONF" 2>/dev/null || true
  sed -i "s/server_name ${APEX} ${DOMAIN};/server_name ${DOMAIN};/" "$SSL_CONF" 2>/dev/null || true
fi

nginx -t
systemctl reload nginx
echo "==> Apex ${APEX} now redirects to https://${DOMAIN}"
