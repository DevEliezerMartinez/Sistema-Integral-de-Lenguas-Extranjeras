# Docker Setup - Sistema de Lenguas Extranjeras

Este documento describe cómo ejecutar el Sistema Integral de Lenguas Extranjeras usando Docker.

## 📋 Requisitos

- Docker Desktop instalado y ejecutándose
- Git (para clonar el repositorio)

## 🚀 Inicio Rápido

### 1. Preparación

Asegúrate de tener un archivo `.env` en la carpeta `Back/`:

```powershell
cd Back
cp .env.example .env
```

**Importante:** No es necesario modificar el `.env` para Docker. El archivo `docker-compose.yml` configura las variables necesarias automáticamente.

### 2. Construir e Iniciar los Contenedores

Desde la raíz del proyecto:

```powershell
docker-compose up --build
```

La primera vez tardará más tiempo porque debe:
- Descargar las imágenes base de Docker
- Instalar dependencias de PHP (Composer)
- Instalar dependencias de Node.js (npm)
- Compilar el frontend React
- Ejecutar migraciones de la base de datos

### 3. Acceder a la Aplicación

Una vez que veas el mensaje `✅ Backend Laravel iniciado correctamente`, abre tu navegador en:

```
http://localhost
```

## 🛠️ Comandos Útiles

### Ver Logs

```powershell
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo del nginx
docker-compose logs -f nginx
```

### Detener los Contenedores

```powershell
# Detener sin eliminar
docker-compose stop

# Detener y eliminar contenedores
docker-compose down
```

### Reiniciar Servicios

```powershell
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar solo el backend
docker-compose restart backend
```

### Ejecutar Comandos Artisan

```powershell
# Acceder al contenedor del backend
docker-compose exec backend sh

# Ejecutar migraciones
docker-compose exec backend php artisan migrate

# Ejecutar seeders
docker-compose exec backend php artisan db:seed

# Limpiar caché
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
```

### Reconstruir Completamente

Si haces cambios en `package.json`, `composer.json`, o archivos de Docker:

```powershell
docker-compose down
docker-compose up --build --force-recreate
```

## 📂 Arquitectura de Contenedores

La aplicación usa 3 contenedores:

1. **backend** - Laravel 11 con PHP 8.2-FPM
   - Puerto interno: 9000
   - Base de datos: SQLite en `Back/database/database.sqlite`
   
2. **frontend** - React 18 compilado y servido por Nginx
   - Puerto interno: 80
   
3. **nginx** - Reverse Proxy
   - Puerto externo: 80
   - Enruta `/api/*` → backend
   - Enruta `/*` → frontend

## 🔐 Autenticación y CORS

La configuración está optimizada para Laravel Sanctum con autenticación basada en cookies:

- **CORS**: Configurado con `supports_credentials: true`
- **Sanctum**: Dominios stateful configurados para `localhost` y `127.0.0.1`
- **Session**: Cookies con `SameSite=lax`
- **CSRF**: Token manejado automáticamente por axios

## 🗃️ Persistencia de Datos

Los siguientes directorios están montados como volúmenes para persistir datos:

- `./Back/database` - Base de datos SQLite
- `./Back/storage` - Archivos subidos y logs

Aunque detengas y elimines los contenedores, estos datos se mantienen.

## 🌐 Uso con IP de Red

Si quieres acceder desde otros dispositivos en tu red local:

1. Obtén tu IP local:
   ```powershell
   ipconfig
   ```
   Ejemplo: `192.168.1.100`

2. Edita `docker-compose.yml` y actualiza:
   ```yaml
   environment:
     - FRONTEND_URL=http://192.168.1.100
     - SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,192.168.1.100
   ```

3. Reconstruye:
   ```powershell
   docker-compose down
   docker-compose up --build
   ```

4. Accede desde otros dispositivos a: `http://192.168.1.100`

## ⚠️ Solución de Problemas

### Error 500 al iniciar sesión

- Verifica que `database.sqlite` existe en `Back/database/`
- Revisa los logs: `docker-compose logs backend`
- Asegúrate de que las migraciones se ejecutaron

### Error de CORS

- Verifica que `FRONTEND_URL` y `SANCTUM_STATEFUL_DOMAINS` estén correctamente configurados
- Reconstruye los contenedores con `--build`
- Limpia la caché del navegador

### El frontend no carga

- Verifica que el build de React se completó: `docker-compose logs frontend`
- Revisa los logs de nginx: `docker-compose logs nginx`

### Base de datos bloqueada (SQLite)

Si ves errores de "database is locked":
```powershell
docker-compose restart backend
```

## 🔄 Volver al Desarrollo Local

Si prefieres volver a `php artisan serve` + `npm run dev`:

1. Detén Docker:
   ```powershell
   docker-compose down
   ```

2. Actualiza `Back/.env`:
   ```env
   FRONTEND_URL=http://localhost:5173
   SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
   SESSION_DRIVER=file
   ```

3. Inicia los servicios localmente:
   ```powershell
   # Terminal 1 - Backend
   cd Back
   php artisan serve

   # Terminal 2 - Frontend
   cd Frontend
   npm run dev
   ```
