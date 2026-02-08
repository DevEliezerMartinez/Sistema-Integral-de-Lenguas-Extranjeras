# Sistema de Gestión de Lenguas Extranjeras

Este proyecto implementa un Sistema de Información para la Gestión de Lenguas Extranjeras destinado a la Coordinación de Lenguas Extranjeras del Tecnológico Nacional de México Campus San Marcos.

## Descripción

El sistema está diseñado para optimizar procesos administrativos y académicos, mejorando la eficiencia operativa y ofreciendo un seguimiento detallado del progreso académico. El proyecto abarca desde la investigación y análisis de requerimientos hasta la implementación y despliegue de la plataforma.

## Características Principales

### Gestión de Usuarios

- Registro y administración de cuentas de usuario.
- Autenticación segura mediante cookies HTTP-only (Laravel Sanctum) y protección CSRF.
- Control de acceso basado en roles y permisos.
- Perfiles de usuario con información académica y administrativa.

### Gestión Académica

- Administración completa de cursos de lenguas extranjeras.
- Registro y seguimiento detallado de estudiantes.
- Creación y gestión de grupos y horarios.
- Registro de calificaciones y evaluaciones.

### Gestión Administrativa

- Gestión de procesos de inscripción.
- Administración digital de documentación y expedientes.
- Control de trámites internos y reportes.

### Sistema de Notificaciones

- Emisión de alertas administrativas.
- Recordatorios de eventos clave y fechas importantes.

## Arquitectura y Tecnologías

El sistema opera como una **Single Page Application (SPA)** con arquitectura desacoplada.

- **Backend (API RESTful):**
  - **Framework:** Laravel 11 (PHP 8.2)
  - **Base de Datos:** SQLite (Local) / Compatible con MySQL/PostgreSQL (Producción)
  - **Seguridad:** Laravel Sanctum (Auth), Bcrypt (Password Hashing)
  - **Servidor:** Nginx + PHP-FPM

- **Frontend:**
  - **Biblioteca:** React 18
  - **Build Tool:** Vite
  - **Estilos:** TailwindCSS
  - **Routing:** React Router
  - **Cliente HTTP:** Axios

- **Infraestructura:**
  - **Containerización:** Docker & Docker Compose
  - **Proxy Inverso:** Nginx

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker Desktop** (versión 20.10 o superior)
  - Windows: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Asegúrate de que Docker Desktop esté corriendo
- **Git** (para clonar el repositorio)

## Estructura del Proyecto

```
.
├── Back/                   # Backend Laravel
├── Frontend/              # Frontend React
├── docker/
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── entrypoint.sh
│   ├── frontend/
│   │   └── Dockerfile
│   └── nginx/
│       └── nginx.conf
└── docker-compose.yml     # Configuración de Docker Compose
```

## Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone <https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras.git>
cd Sistema-Integral-de-Lenguas-Extranjeras
```

### 2. Configurar Line Endings (IMPORTANTE en Windows)

El archivo `entrypoint.sh` debe tener line endings de Unix (LF) en lugar de Windows (CRLF). Si estás en Windows, ejecuta:

**PowerShell:**

```powershell
$content = Get-Content docker/backend/entrypoint.sh -Raw
$content = $content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("$PWD\docker\backend\entrypoint.sh", $content, [System.Text.UTF8Encoding]::new($false))
```

**Git Bash / Linux / macOS:**

```bash
dos2unix docker/backend/entrypoint.sh
```

O configura Git para manejar line endings automáticamente:

```bash
git config core.autocrlf false
```

### 3. Construir las Imágenes Docker

```bash
docker-compose build --no-cache
```

Este proceso puede tardar varios minutos la primera vez.

### 4. Iniciar los Contenedores

```bash
docker-compose up -d
```

Este comando iniciará tres contenedores:

- **lenguas_backend**: Backend Laravel con PHP-FPM
- **lenguas_frontend**: Frontend React
- **lenguas_nginx**: Servidor web Nginx (puerto 80)

### 5. Verificar el Estado

Verifica que todos los contenedores estén corriendo:

```bash
docker ps
```

Deberías ver los tres contenedores con estado "Up".

### 6. Acceder a la Aplicación

Abre tu navegador y visita:

```
http://localhost
```

## Comandos Útiles

### Ver logs de un contenedor

```bash
docker logs lenguas_backend
docker logs lenguas_frontend
docker logs lenguas_nginx
```

### Ver logs en tiempo real

```bash
docker logs -f lenguas_backend
```

### Detener los contenedores

```bash
docker-compose down
```

### Reiniciar los contenedores

```bash
docker-compose restart
```

### Reconstruir y reiniciar un servicio específico

```bash
docker-compose build backend
docker-compose up -d backend
```

### Acceder al shell de un contenedor

```bash
docker exec -it lenguas_backend sh
```

## Solución de Problemas

### Error: "exec /usr/local/bin/entrypoint.sh: no such file or directory"

**Causa**: El archivo `entrypoint.sh` tiene line endings de Windows (CRLF).

**Solución**: Ejecuta el comando del Paso 2 para convertir los line endings a formato Unix (LF), luego reconstruye:

```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Error: "host not found in upstream backend:9000"

**Causa**: El contenedor backend no está corriendo correctamente.

**Solución**:

1. Verifica el estado: `docker ps -a`
2. Revisa los logs: `docker logs lenguas_backend`
3. Si es necesario, reconstruye: `docker-compose build --no-cache backend && docker-compose up -d`

### Error: "Unable to connect to the remote server" al acceder a localhost

**Causa**: Los contenedores no están corriendo o están reiniciándose continuamente.

**Solución**:

1. Verifica el estado: `docker ps -a`
2. Si los contenedores están "Restarting", revisa los logs de cada uno
3. Detén todo: `docker-compose down`
4. Reconstruye: `docker-compose build --no-cache`
5. Inicia de nuevo: `docker-compose up -d`

### Puerto 80 ya está en uso

**Causa**: Otro servicio está usando el puerto 80.

**Solución**:
Opción 1 - Detener el otro servicio (IIS, Apache, etc.)

Opción 2 - Cambiar el puerto en `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80" # Cambia 80 por 8080
```

Luego accede a `http://localhost:8080`

### Verificar que Docker Desktop está corriendo

En Windows, asegúrate de que Docker Desktop esté abierto y corriendo. Puedes verificarlo ejecutando:

```bash
docker --version
docker ps
```

## Configuración para Acceso en Red Local (Opcional)

Si solo vas a usar la aplicación en la misma máquina donde la instalaste, no necesitas hacer nada (`localhost` funcionará bien).

Si deseas acceder a la aplicación desde **otros dispositivos en tu red local** (por ejemplo, desde tu celular u otra PC), debes configurar tu dirección IP:

1.  Obtén tu dirección IP local:
    - Windows: Ejecuta `ipconfig` en la terminal.
    - Linux/Mac: Ejecuta `hostname -I` o `ifconfig`.
2.  Abre el archivo `docker-compose.yml`.
3.  Reemplaza todas las ocurrencias de `localhost` por tu dirección IP (ej. `192.168.1.50`) en:
    - `APP_URL`
    - `FRONTEND_URL`
    - `SANCTUM_STATEFUL_DOMAINS` (añade tu IP a la lista: `localhost,127.0.0.1,TU_IP`)
    - `VITE_API_URL`
4.  Reconstruye los contenedores para aplicar los cambios:
    ```bash
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    ```

## Detalles Técnicos Adicionales

### Base de Datos

El proyecto usa SQLite como base de datos, que se crea automáticamente en: `Back/database/database.sqlite`. Las migraciones se ejecutan automáticamente al iniciar el contenedor backend.

### Variables de Entorno

Las variables de entorno están configuradas en `docker-compose.yml`. Los valores importantes son:

- **APP_URL**: `http://localhost`
- **FRONTEND_URL**: `http://localhost`
- **DB_CONNECTION**: `sqlite`

### Notas

- La primera vez que se inicia el proyecto, el backend ejecutará migraciones y configuración inicial.
- Los archivos de storage de Laravel están montados como volúmenes para persistencia.
- El proyecto está configurado para reiniciarse automáticamente (`restart: unless-stopped`).

---

## Créditos y Licencia

**Autor:** Eliezer Solano Martinez  
**Institución:** Tecnológico Nacional de México, Campus San Marcos  
**Repositorio:** [GitHub](https://github.com/DevEliezerMartinez/Sistema-Integral-de-Lenguas-Extranjeras)

Este proyecto se distribuye bajo la licencia **MIT**, permitiendo su uso y modificación con fines académicos y administrativos.
