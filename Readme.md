# Sistema de Gestión de Lenguas Extranjeras

Sistema de Información para la Gestión de Lenguas Extranjeras del Tecnológico Nacional de México Campus San Marcos. Plataforma web completa para administración académica y seguimiento de estudiantes.

## 🚀 Instalación Rápida

### Requisitos Previos

- **Docker Desktop** (versión 20.10+) - [Descargar aquí](https://www.docker.com/products/docker-desktop)
- **Git** / **Git Bash** (Recomendado en Windows para ejecutar el script)

### Opción 1: Instalación Automatizada (Recomendada)

Hemos creado scripts de despliegue que configuran dinámicamente tu IP local, reparan saltos de línea y configuran automáticamente los contenedores listos para usarse.

#### Si estás en Windows (Powershell):
Abre PowerShell en la carpeta del repositorio y ejecuta:

```powershell
# 1. Clonar el repositorio
git clone https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras.git
cd Sistema-Integral-de-Lenguas-Extranjeras

# 2. Ejecutar el script (puede que necesites permisos)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
.\build.ps1
```

#### Si estás en Linux / macOS / Git Bash:
Ejecuta el script equivalente para bash:

```bash
# 1. Clonar el repositorio
git clone https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras.git
cd Sistema-Integral-de-Lenguas-Extranjeras

# 2. Ejecutar el script
bash build.sh
```

El script interactivo te preguntará qué IP deseas usar para la red local y luego levantará el sistema de forma limpia. Al finalizar te mostrará la URL de acceso.

### Opción 2: Instalación Manual

Si prefieres hacerlo manualmente de la forma tradicional:

```bash
# 1. Clonar el repositorio
git clone https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras.git
cd Sistema-Integral-de-Lenguas-Extranjeras

# 2. Configurar line endings (SOLO EN WINDOWS)
# PowerShell:
$content = Get-Content docker/backend/entrypoint.sh -Raw; $content = $content -replace "`r`n", "`n"; [System.IO.File]::WriteAllText("$PWD\docker\backend\entrypoint.sh", $content, [System.Text.UTF8Encoding]::new($false))

# Git Bash / Linux / macOS:
dos2unix docker/backend/entrypoint.sh

# 3. Construir e iniciar
docker-compose build --no-cache
docker-compose up -d

# 4. Verificar que todo esté corriendo
docker ps
```

**Accede a:** `http://localhost` (o la IP que configuraste en tu `.env`)

---

## 🌐 Configuración para Red Local

Para acceder desde otros dispositivos en tu red (celular, otras PCs), es importante configurar tu IP local.

> **¡Atención!** Si utilizaste la **Opción 1: Instalación Automatizada** con `build.sh`, estos pasos ya se han realizado automáticamente y **NO** necesitas hacerlos.

Si elegiste la Instalación Manual, debes seguir estos pasos:

### 1. Crear configuración local

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

### 2. Obtener tu IP local

```bash
# Windows
ipconfig
# Busca "Dirección IPv4" (ej: 192.168.1.50)

# Linux/Mac
hostname -I
```

### 3. Configurar la IP en .env

Abre el archivo `.env` que acabas de crear y establece tu IP:

```ini
HOST_IP=192.168.1.50  <-- Tu IP aquí
```

### 4. Aplicar cambios

Es **CRÍTICO** usar `--build` para que la configuración se aplique al frontend:

```bash
docker-compose down
docker-compose up -d --build
```

**Accede desde cualquier dispositivo en tu red:** `http://TU_IP`

---

## 📋 Comandos Esenciales

### Gestión de Contenedores

```bash
# Ver estado de contenedores
docker ps

# Ver logs en tiempo real
docker logs -f lenguas_backend
docker logs -f lenguas_frontend
docker logs -f lenguas_nginx

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart backend
```

### Acceso a Contenedores

```bash
# Acceder al shell del backend
docker exec -it lenguas_backend sh

# Acceder al shell del frontend
docker exec -it lenguas_frontend sh
```

---

## 🧹 Limpieza y Eliminación

### Limpieza Completa (Eliminar TODO)

```bash
# Opción 1: Eliminar contenedores, imágenes Y base de datos
docker-compose down --rmi local -v

# Opción 2: Eliminar contenedores e imágenes (mantiene BD)
docker-compose down --rmi local

# Opción 3: Solo detener contenedores
docker-compose down
```

### Limpieza Manual

```bash
# Ver todas las imágenes
docker images

# Eliminar imagen específica
docker rmi <IMAGE_ID>

# Limpiar imágenes sin usar
docker image prune

# Limpiar todo el sistema Docker
docker system prune -a
```

### Reinstalación Limpia

```bash
# 1. Eliminar todo
docker-compose down --rmi local -v

# 2. Reconstruir desde cero
docker-compose build --no-cache

# 3. Iniciar de nuevo
docker-compose up -d
```

---

## 🛠️ Solución de Problemas

### Error: "exec /usr/local/bin/entrypoint.sh: no such file or directory"

**Causa:** Line endings incorrectos en Windows.

**Solución:**

```bash
# Convertir line endings
$content = Get-Content docker/backend/entrypoint.sh -Raw; $content = $content -replace "`r`n", "`n"; [System.IO.File]::WriteAllText("$PWD\docker\backend\entrypoint.sh", $content, [System.Text.UTF8Encoding]::new($false))

# Reconstruir
docker-compose build --no-cache backend
docker-compose up -d
```

### Error: "host not found in upstream backend:9000"

**Solución:**

```bash
docker logs lenguas_backend
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Puerto 80 ocupado

**Opción 1:** Detén el servicio que usa el puerto 80 (IIS, Apache, etc.)

**Opción 2:** Cambia el puerto en `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80" # Accede con http://localhost:8080
```

### Contenedores reiniciándose continuamente

```bash
# Ver qué está fallando
docker ps -a
docker logs lenguas_backend
docker logs lenguas_frontend

# Reiniciar limpio
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📁 Estructura del Proyecto

```
.
├── Back/                      # Backend Laravel 11
│   ├── app/
│   ├── database/
│   │   └── database.sqlite    # Base de datos SQLite
│   └── ...
├── Frontend/                  # Frontend React 18
│   ├── src/
│   └── ...
├── docker/
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── entrypoint.sh
│   ├── frontend/
│   │   └── Dockerfile
│   └── nginx/
│       └── nginx.conf
└── docker-compose.yml         # Configuración principal
```

---

## 🔧 Arquitectura y Tecnologías

### Backend (API RESTful)

- **Framework:** Laravel 11 (PHP 8.2)
- **Base de Datos:** SQLite (desarrollo) / MySQL/PostgreSQL (producción)
- **Autenticación:** Laravel Sanctum (cookies HTTP-only)
- **Seguridad:** CSRF protection, Bcrypt
- **Servidor:** Nginx + PHP-FPM

### Frontend (SPA)

- **Biblioteca:** React 18
- **Build Tool:** Vite
- **Estilos:** TailwindCSS
- **Routing:** React Router
- **Cliente HTTP:** Axios

### Infraestructura

- **Containerización:** Docker & Docker Compose
- **Proxy Inverso:** Nginx
- **Puertos:** 80 (HTTP)

---

## ✨ Características Principales

### Gestión de Usuarios

- Registro y autenticación segura
- Control de acceso basado en roles
- Perfiles de usuario personalizados

### Gestión Académica

- Administración de cursos de lenguas
- Seguimiento detallado de estudiantes
- Gestión de grupos y horarios
- Registro de calificaciones

### Gestión Administrativa

- Procesos de inscripción
- Documentación digital
- Control de trámites y reportes

### Sistema de Notificaciones

- Alertas administrativas
- Recordatorios automáticos

---

## 📝 Notas Técnicas

- **Base de Datos:** Se crea automáticamente en `Back/database/database.sqlite`
- **Migraciones:** Se ejecutan automáticamente al iniciar el backend
- **Persistencia:** Los archivos de storage están montados como volúmenes
- **Reinicio Automático:** Los contenedores se reinician automáticamente si fallan
- **Variables de Entorno:** Configuradas en `docker-compose.yml`

---

## 👨‍💻 Créditos

**Autor:** Eliezer Solano Martinez  
**Institución:** Tecnológico Nacional de México, Campus San Marcos  
**Repositorio:** [GitHub](https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras)  
**Licencia:** MIT

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección de **Solución de Problemas**
2. Verifica los logs: `docker logs lenguas_backend`
3. Asegúrate de que Docker Desktop esté corriendo
4. Intenta una reinstalación limpia

Para reportar issues: [GitHub Issues](https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras/issues)
