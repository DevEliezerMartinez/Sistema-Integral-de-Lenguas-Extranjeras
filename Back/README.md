# Backend - Sistema de Gestión de Lenguas Extranjeras

Este es el backend del Sistema de Gestión de Lenguas Extranjeras, construido con **Laravel 11** y **PHP 8.2**.

## Descripción

API RESTful que maneja toda la lógica de negocio, autenticación, y persistencia de datos para el sistema de gestión de lenguas extranjeras del TecNM Campus San Marcos.

## Tecnologías

- **Framework:** Laravel 11
- **Lenguaje:** PHP 8.2
- **Autenticación:** Laravel Sanctum
- **Base de Datos:** SQLite (desarrollo/producción local)
- **Validación:** Form Requests de Laravel
- **Testing:** PHPUnit

## Características Principales

- Autenticación basada en cookies con Laravel Sanctum
- API RESTful para operaciones CRUD
- Migraciones y Seeders para gestión de base de datos
- Validación de datos con Form Requests
- Políticas de CORS configuradas para SPA

## Requisitos Previos

- **PHP** 8.2 o superior
- **Composer** (gestor de dependencias de PHP)
- **SQLite3** (para base de datos)

## Instalación Local

Para ejecutar el backend de manera aislada (sin Docker) para desarrollo:

1. Navega a la carpeta del backend:
   ```bash
   cd Back
   ```

2. Instala las dependencias de PHP:
   ```bash
   composer install
   ```

3. Crea el archivo de configuración:
   ```bash
   cp .env.example .env
   ```
   
   Abre el archivo `.env` y ajusta las siguientes variables según sea necesario:
   - `APP_URL`: URL de tu aplicación (por defecto `http://localhost`)
   - `FRONTEND_URL`: URL donde se ejecuta el frontend (importante para CORS)
   - `DB_CONNECTION`: Tipo de base de datos (por defecto `sqlite`)
   
   **Nota:** El archivo `.env.example` incluye todas las variables de configuración necesarias con valores predeterminados.

4. Genera la clave de aplicación:
   ```bash
   php artisan key:generate
   ```

5. Crea el archivo de base de datos SQLite:
   ```bash
   touch database/database.sqlite
   ```

6. Ejecuta las migraciones:
   ```bash
   php artisan migrate
   ```

7. (Opcional) Ejecuta los seeders para datos de prueba:
   ```bash
   php artisan db:seed
   ```

8. Inicia el servidor de desarrollo:
   ```bash
   php artisan serve
   ```
   El servidor estará disponible en `http://localhost:8000`.

## Docker

En el entorno de producción, el backend utiliza **PHP-FPM** y se sirve a través de Nginx configurado en el contenedor del frontend.
La configuración se encuentra en `Dockerfile.prod` y se orquesta mediante `docker-compose.prod.yml` en la raíz del proyecto.

## Estructura del Proyecto

- `app/`: Código de la aplicación (Modelos, Controladores, Middleware, etc.)
- `config/`: Archivos de configuración
- `database/`: Migraciones, Seeders, y Factories
- `routes/`: Definición de rutas (API, Web, etc.)
- `storage/`: Archivos generados, logs, y archivos subidos
- `tests/`: Pruebas unitarias y de integración

## Comandos Útiles

```bash
# Limpiar caché de configuración
php artisan config:clear

# Limpiar caché de rutas
php artisan route:clear

# Ver todas las rutas registradas
php artisan route:list

# Ejecutar tests
php artisan test
```
