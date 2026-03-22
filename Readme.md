# Sistema de Gestión de Lenguas Extranjeras

Sistema de Información para la Gestión de Lenguas Extranjeras del Tecnológico Nacional de México Campus San Marcos. Plataforma web completa para administración académica y seguimiento de estudiantes.

---

## 🚀 Instalación Rápida

### Requisitos Previos

- **Docker Desktop** (versión 20.10+) — [Descargar aquí](https://www.docker.com/products/docker-desktop)
- **Git** — [Descargar aquí](https://git-scm.com/)

### Windows (PowerShell)

```powershell
# 1. Clonar el repositorio
git clone https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras.git
cd Sistema-Integral-de-Lenguas-Extranjeras

# 2. Ejecutar el script de despliegue
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; .\build.ps1
```

### Linux / macOS / Git Bash

```bash
# 1. Clonar el repositorio
git clone https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras.git
cd Sistema-Integral-de-Lenguas-Extranjeras

# 2. Ejecutar el script de despliegue
bash build.sh
```

El script te preguntará qué IP usar y levantará todos los servicios automáticamente. Al finalizar mostrará la URL de acceso.

> **Nota:** Si es la primera vez que accedes a la app o tuviste instalaciones previas, abre el navegador en **modo incógnito** para evitar conflictos con cookies de sesiones anteriores.

---

## 🌐 Acceso desde Red Local

Para acceder desde otros dispositivos en tu red (celular, otras PCs), selecciona tu IP local cuando el script te lo pida. Puedes consultarla con:

```bash
# Windows
ipconfig
# Busca "Dirección IPv4" (ej: 192.168.1.50)

# Linux / macOS
hostname -I
```

Luego accede desde cualquier dispositivo en tu red con: `http://TU_IP`

---

## 📋 Comandos Esenciales

```bash
# Ver estado de contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f
docker compose logs -f backend
docker compose logs -f nginx

# Reiniciar un servicio específico
docker compose restart nginx

# Detener todos los servicios
docker compose down

# Acceder al shell del backend
docker exec -it lenguas_backend sh
```

---

## 🧹 Limpieza y Reinstalación

```bash
# Detener y eliminar contenedores, volúmenes e imágenes
docker compose down --volumes
docker rmi sistema-integral-de-lenguas-extranjeras-backend
docker rmi sistema-integral-de-lenguas-extranjeras-frontend

# Reinstalar desde cero
.\build.ps1   # Windows
bash build.sh # Linux / macOS
```

---

## 🛠️ Solución de Problemas

### Backend en estado `Restarting`

```bash
docker compose logs -f backend
```

Las causas más comunes son:

- Falta el archivo `Back/.env` — el sistema lo crea automáticamente desde `Back/.env.example` al arrancar.
- Permisos incorrectos en `storage/` — el entrypoint los corrige automáticamente.

### Error 502 Bad Gateway

El backend aún está inicializando (migraciones, seeders). Espera unos segundos y recarga. Si persiste:

```bash
docker compose logs -f backend
```

### Error 400 Bad Request — Request Header Or Cookie Too Large

Las cookies de sesiones anteriores se acumularon en el navegador. Solución: abre la app en una **ventana de incógnito** o limpia las cookies del sitio desde DevTools (F12 → Application → Cookies).

### Puerto 80 ocupado

Cambia el puerto en `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80"
```

Luego accede con `http://localhost:8080`.

### Error: line endings en Windows

El script `build.ps1` convierte automáticamente los line endings de `entrypoint.sh`. Si lo ejecutas manualmente:

```powershell
$c = Get-Content docker/backend/entrypoint.sh -Raw
$c = $c -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("$PWD\docker\backend\entrypoint.sh", $c, [System.Text.UTF8Encoding]::new($false))
docker compose build --no-cache backend
docker compose up -d
```

---

## 📁 Estructura del Proyecto

```
.
├── Back/                      # Backend Laravel 11 (PHP 8.2)
│   ├── app/
│   ├── database/
│   │   └── database.sqlite    # Base de datos SQLite (generada automáticamente)
│   ├── .env.example           # Plantilla de configuración
│   └── ...
├── Frontend/                  # Frontend React 18
│   ├── src/
│   └── ...
├── docker/
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── entrypoint.sh      # Inicialización del backend
│   ├── frontend/
│   │   └── Dockerfile
│   └── nginx/
│       └── nginx.conf         # Proxy inverso
├── docker-compose.yml
├── build.ps1                  # Script de despliegue Windows
└── build.sh                   # Script de despliegue Linux/macOS
```

---

## 🔧 Arquitectura

| Capa          | Tecnología                          |
| ------------- | ----------------------------------- |
| Backend       | Laravel 11 + PHP 8.2 + PHP-FPM      |
| Frontend      | React 18 + Vite + TailwindCSS       |
| Base de datos | SQLite                              |
| Autenticación | Laravel Sanctum (cookies HTTP-only) |
| Proxy inverso | Nginx                               |
| Contenedores  | Docker + Docker Compose             |

---

## ✨ Características Principales

- **Roles de usuario:** Estudiante, Docente, Coordinador
- **Gestión académica:** Cursos, grupos, horarios, calificaciones
- **Inscripciones:** Flujo completo de registro y documentación
- **Notificaciones:** Alertas y recordatorios automáticos
- **Acceso por red local:** Configurable para múltiples dispositivos

---

## 📝 Notas Técnicas

- La base de datos SQLite y el `.env` del backend se crean automáticamente al primer arranque.
- Las migraciones y seeders se ejecutan automáticamente en cada despliegue.
- Las sesiones anteriores se limpian automáticamente en cada reinicio del backend.
- Los volúmenes de `storage/` y `database/` persisten entre reinicios.
- El `vendor/` de Composer se genera durante el build y se protege con un named volume para que no sea sobreescrito por el montaje local.

---

## 👨‍💻 Créditos

**Autor:** Eliezer Solano Martinez  
**Institución:** Tecnológico Nacional de México, Campus San Marcos  
**Repositorio:** [GitHub](https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras)  
**Licencia:** MIT

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección **Solución de Problemas** de este README
2. Consulta los logs: `docker compose logs -f backend`
3. Verifica que Docker Desktop esté corriendo
4. Intenta una reinstalación limpia

Para reportar issues: [GitHub Issues](https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras/issues)
