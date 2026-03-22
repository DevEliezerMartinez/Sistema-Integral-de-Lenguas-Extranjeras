#!/bin/sh
set -e

echo ">>> Iniciando backend Laravel..."

# Crear directorios de storage si no existen
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/app/public
mkdir -p /var/www/html/storage/logs

# Crear base de datos SQLite si no existe
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo ">>> Creando base de datos SQLite..."
    touch /var/www/html/database/database.sqlite
fi

# Crear .env desde .env.example si no existe
if [ ! -f /var/www/html/.env ]; then
    echo ">>> Creando .env desde .env.example..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Configurar permisos
echo ">>> Configurando permisos..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
chmod 664 /var/www/html/database/database.sqlite

# Generar clave de aplicacion si no existe
if ! grep -q "APP_KEY=" /var/www/html/.env 2>/dev/null || grep -q "APP_KEY=$" /var/www/html/.env 2>/dev/null; then
    echo ">>> Generando APP_KEY..."
    php artisan key:generate --force
fi

# Ejecutar migraciones
echo ">>> Ejecutando migraciones..."
php artisan migrate --force

# Ejecutar seeders
echo ">>> Ejecutando seeders..."
php artisan db:seed --force

# Limpiar cache antes de cachear de nuevo
echo ">>> Limpiando cache..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Cachear configuracion para produccion
echo ">>> Cacheando configuracion..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Crear enlace simbolico de storage
echo ">>> Creando enlace simbolico de storage..."
php artisan storage:link || true

echo ">>> Backend Laravel iniciado correctamente"

# Iniciar PHP-FPM
exec php-fpm