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

El script detecta automáticamente tus adaptadores de red físicos (Ethernet / Wi-Fi), filtra adaptadores virtuales (VPN, VMware, WSL, Docker, etc.) y muestra un menú numerado para que elijas la IP correcta. Al finalizar mostrará la URL de acceso.

> **Nota:** Si es la primera vez que accedes a la app o tuviste instalaciones previas, abre el navegador en **modo incógnito** para evitar conflictos con cookies de sesiones anteriores.

---

## 🌐 Acceso desde Red Local

El script `build.ps1` lista automáticamente los adaptadores físicos encontrados con su IP, por lo que **normalmente no necesitas consultar tu IP manualmente**. Si aun así lo necesitas:

```powershell
# Windows — muestra todas las IPs de red
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^127\.' } | Select-Object InterfaceAlias, IPAddress
```

```bash
# Linux / macOS
hostname -I
```

Elige la IP del adaptador que conecta tu PC a la red (Ethernet o Wi-Fi). Luego accede desde cualquier dispositivo en la misma red con:

```
http://<TU_IP>
```

> Nginx está configurado con `server_name _;` para aceptar peticiones con cualquier `Host` header (IP, nombre de host, etc.), por lo que **no se requiere ninguna configuración adicional** para acceder desde la red.

> [!WARNING]
> **La IP cambia si cambias de red.**
> La IP que eliges durante el despliegue queda fija en la configuración de Docker. Si la PC cambia de adaptador de red (por ejemplo, conectas un cable Ethernet estando en Wi-Fi, o al contrario), el sistema operativo asigna una IP diferente y **la app dejará de ser accesible desde otros dispositivos**.
>
> **¿Qué hacer en ese caso?**
> 1. Comprueba tu nueva IP:
>    ```powershell
>    Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^127\.' } | Select-Object InterfaceAlias, IPAddress
>    ```
> 2. Vuelve a ejecutar el script de despliegue para actualizar la configuración:
>    ```powershell
>    .\build.ps1
>    ```
> 3. El script detectará los adaptadores disponibles, elige el que corresponda a tu conexión activa (Ethernet o Wi-Fi).
> 4. Comparte la nueva IP con los demás dispositivos de la red.

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

Nginx espera hasta **120 segundos** tanto a PHP-FPM como al frontend antes de reportar 502, por lo que debería desaparecer solo una vez que el backend termine de ejecutar migraciones y seeders. Si persiste tras ese tiempo:

```bash
# Ver en qué paso falla el backend
docker compose logs -f backend

# Ver qué reporta Nginx
docker compose logs -f nginx
```

Causas comunes:
- El contenedor `lenguas_backend` está en `Restarting` — revisa los logs del backend.
- El contenedor `lenguas_frontend` tardó más de 120s en arrancar — ejecuta `docker compose restart nginx` tras verificar que el frontend esté `Up`.

### Cookies de sesión / Sanctum no funcionan desde otro dispositivo

Sanctum valida el `Host` header de la petición (incluyendo el puerto). El proyecto ya incluye las variantes con y sin `:80` en `SANCTUM_STATEFUL_DOMAINS`, pero si cambias el puerto de Nginx en `docker-compose.yml` debes agregar también ese puerto:

```yaml
# docker-compose.yml — variable de entorno del servicio backend
- SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8080,<TU_IP>,<TU_IP>:8080
```

Recuerda siempre hacer la petición a `/sanctum/csrf-cookie` primero y usar `withCredentials: true` / `credentials: 'include'` en el frontend.

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
- **Nginx** usa `server_name _;` (catch-all) para responder a cualquier IP o hostname, y timeouts de 120s para evitar 502 durante el arranque lento del backend o frontend.
- **Sanctum** maneja todas las cookies de sesión (`XSRF-TOKEN`, `laravel_session`). `SANCTUM_STATEFUL_DOMAINS` incluye automáticamente la IP elegida con y sin el puerto `:80`.
- **`build.ps1`** filtra adaptadores virtuales (VMware, VirtualBox, WSL, Docker, VPN, Hyper-V) y prioriza Ethernet/Wi-Fi físico en el menú de selección de IP.

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
