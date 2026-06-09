#!/bin/bash
# Enable contact form email on the VPS (PHP + mail)
set -euo pipefail

echo "==> Installing PHP-FPM..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq php-fpm php-cli

PHP_SOCK=$(find /run/php -name 'php*-fpm.sock' 2>/dev/null | head -1)
if [ -z "$PHP_SOCK" ]; then
  echo "ERROR: PHP-FPM socket not found"
  exit 1
fi
echo "  Using socket: $PHP_SOCK"

echo "==> Installing mail utilities..."
apt-get install -y -qq msmtp-mta mailutils 2>/dev/null || apt-get install -y -qq postfix mailutils

echo "==> Updating nginx config..."
cp /tmp/nginx-get-consult.conf /etc/nginx/sites-available/get-consult
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/get-consult /etc/nginx/sites-enabled/get-consult

# Inject PHP handler if not present
if ! grep -q 'location /api/' /etc/nginx/sites-available/get-consult; then
  sed -i "/location \/ {/i\\
    location /api/ {\\
        include snippets/fastcgi-php.conf;\\
        fastcgi_pass unix:${PHP_SOCK};\\
    }\\
" /etc/nginx/sites-available/get-consult
fi

nginx -t
systemctl reload nginx
systemctl enable php*-fpm 2>/dev/null || true
systemctl restart php*-fpm 2>/dev/null || true

echo ""
echo "Contact form API: POST /api/contact.php"
echo "Booking API:      POST /api/booking.php"
echo "Test contact: curl -X POST https://get-consult.com/api/contact.php -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"email\":\"you@example.com\",\"message\":\"Hello\"}'"
echo "Test booking: curl -X POST https://get-consult.com/api/booking.php -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"email\":\"you@example.com\",\"date\":\"2026-06-10\",\"time\":\"10:00\"}'"
echo ""
echo "If mail fails, configure SMTP in /etc/msmtprc or postfix."
