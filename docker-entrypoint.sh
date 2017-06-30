#!/bin/bash
set -e

echo "Starting nginx..."
(tail -F /var/log/nginx/access.log &) && exec nginx -g "daemon off;" "$@"

exec "$@"