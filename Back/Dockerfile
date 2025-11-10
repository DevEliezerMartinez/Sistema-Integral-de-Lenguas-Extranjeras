FROM php:8.2-cli

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-install pdo pdo_sqlite mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Crear .env desde .env.example
RUN cp .env.example .env

# Instalar dependencias de Laravel
RUN composer install --no-interaction --optimize-autoloader

# Crear directorio de base de datos si no existe
RUN mkdir -p database

# Dar permisos
RUN chmod -R 775 storage bootstrap/cache database
RUN chown -R www-data:www-data storage bootstrap/cache database

# Generar key de Laravel
RUN php artisan key:generate

# Crear base de datos SQLite si no existe
RUN touch database/database.sqlite

# Crear enlace simbólico de storage
RUN php artisan storage:link || true

# Ejecutar migraciones
RUN php artisan migrate --force || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]