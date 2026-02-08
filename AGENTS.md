# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sistema Integral de Lenguas Extranjeras - A web-based academic management system for the Foreign Languages Coordination at TecNM Campus San Marcos. Built as a decoupled SPA with a Laravel 11 backend and React 18 frontend communicating via RESTful API with JSON.

## Development Commands

### Docker (Primary Development Method)

```powershell
# Start development environment
docker-compose up --build -d

# View logs
docker-compose logs -f

# Run artisan commands
docker-compose exec app php artisan migrate
docker-compose exec app php artisan optimize:clear

# Rebuild from scratch
docker-compose down
docker-compose up --build --force-recreate
```

### Production Deployment

```powershell
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

# Run migrations and seeders
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force
docker-compose -f docker-compose.prod.yml exec backend php artisan db:seed --force
```

### Backend (Laravel) - Run inside `Back/` directory or via Docker

```bash
# Install dependencies
composer install

# Run tests
php artisan test
./vendor/bin/phpunit

# Code formatting (Laravel Pint)
./vendor/bin/pint

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Frontend (React) - Run inside `Frontend/` directory

```bash
# Install dependencies
npm ci

# Development server
npm run dev

# Production build
npm run build

# Linting
npm run lint
```

## Architecture

### Authentication Flow

- Uses Laravel Sanctum with HTTP-only cookies (SPA authentication)
- Frontend stores user info in localStorage via `AuthContext.jsx`
- CSRF token automatically handled via axios interceptor (`Frontend/src/axios.js`)
- Three user roles: `estudiante`, `docente`, `coordinador`

### Backend Structure (`Back/`)

- **API Routes**: `routes/api.php` - All endpoints under `/api/*`
- **Controllers**: `app/Http/Controllers/` - Main business logic
- **Models**: `app/Http/Models/` - Eloquent models with relationships
- **Database**: SQLite for local/dev, configurable via `.env`

### Key Models and Relationships

- `Usuario` → base user with role (`rol` field)
- `Estudiante` → belongsTo Usuario, hasMany Calificaciones, Solicitudes, Constancias
- `Docente` → belongsTo Usuario, hasMany Cursos (via `maestro_id`)
- `Coordinador` → belongsTo Usuario, hasMany Cursos
- `Curso` → belongsTo Docente & Coordinador, hasMany Calificaciones, Solicitudes
- `Solicitud` → enrollment requests linking students to courses

### Frontend Structure (`Frontend/`)

- **Entry**: `src/main.jsx` → `App.jsx` (routing)
- **Auth Context**: `src/AuthContext.jsx` - Global auth state
- **HTTP Client**: `src/axios.js` - Configured with CSRF handling
- **Pages by Role**:
  - `src/pages/public/` - Landing, Login, Registration
  - `src/pages/estudiantes/` - Student dashboard and views
  - `src/pages/docentes/` - Teacher dashboard and views
  - `src/pages/coordinador/` - Coordinator/admin dashboard
- **Shared Components**: `src/components/Shared/`
- **UI Framework**: Ant Design (`antd`) + TailwindCSS

### Docker Architecture

Single container runs both frontend and backend:
- **Nginx**: Reverse proxy routing `/api/*` to Laravel, everything else to React SPA
- **PHP-FPM**: Laravel application server
- **Supervisor**: Process manager for Nginx + PHP-FPM
- **Config files**: `docker/nginx/default.conf`, `docker/supervisor/supervisord.conf`

## API Endpoint Patterns

- Public: `POST /api/login`, `POST /api/register`
- Protected (require `auth:sanctum`):
  - Courses: `/api/cursos`, `/api/cursos/{id}`, `/api/crear_curso`
  - Users: `/api/users`, `/api/infoUser/{id}`, `/api/updateUser/{id}`
  - Students: `/api/estudiante/{id}`, `/api/estudiante/{id}/cursos`
  - Teachers: `/api/docentes`, `/api/cursosAsignados/{docenteId}`
  - Solicitudes: `/api/solicitudes`, `/api/crear_solicitud`, `/api/solicitudes/{id}/aceptar`
  - Grades: `/api/calificaciones`, `/api/calificaciones/{cursoId}`

## Important Configuration

- **Environment Variables**: Backend uses `.env` (copy from `.env.example`), Frontend uses Vite's `VITE_API_URL`
- **Database**: SQLite file at `Back/database/database.sqlite` (must be created manually)
- **Storage**: Uploaded files at `Back/storage/app/public` (symlinked via `php artisan storage:link`)
- **CORS/Sanctum**: Configured for SPA mode in `docker-compose.yml` via `SANCTUM_STATEFUL_DOMAINS`
