#!/bin/sh
set -e

echo "Ã°Å¸Å¡â‚¬ Iniciando backend Laravel..."

# Crear directorios de storage si no existen
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/app/public
mkdir -p /var/www/html/storage/logs

# Crear base de datos SQLite si no existe
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Ã°Å¸â€œÂ¦ Creando base de datos SQLite..."
    touch /var/www/html/database/database.sqlite
fi

# Configurar permisos
echo "Ã°Å¸â€â€™ Configurando permisos..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
chmod 664 /var/www/html/database/database.sqlite

# Generar clave de aplicaciÃƒÂ³n si no existe
if ! grep -q "APP_KEY=" /var/www/html/.env || grep -q "APP_KEY=$" /var/www/html/.env; then
    echo "Ã°Å¸â€â€˜ Generando APP_KEY..."
    php artisan key:generate --force
fi

# Ejecutar migraciones
echo "Ã°Å¸â€œÅ  Ejecutando migraciones..."
php artisan migrate --force

# Limpiar y cachear configuraciÃƒÂ³n
echo "Ã°Å¸â€”â€˜Ã¯Â¸Â Limpiando cachÃƒÂ©..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "Ã°Å¸â€™Â¾ Cacheando configuraciÃƒÂ³n..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Crear enlace simbÃƒÂ³lico de storage
echo "Ã°Å¸â€â€” Creando enlace simbÃƒÂ³lico de storage..."
php artisan storage:link || true

echo "Ã¢Å“â€¦ Backend Laravel iniciado correctamente"

# Iniciar PHP-FPM
exec php-fpm
