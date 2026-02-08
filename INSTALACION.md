# Guía de Instalación - Sistema Integral de Lenguas Extranjeras

Esta guía te ayudará a configurar y ejecutar el proyecto en cualquier máquina.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker Desktop** (versión 20.10 o superior)
  - Windows: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Asegúrate de que Docker Desktop esté corriendo
- **Git** (para clonar el repositorio)

## Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
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
    - "8080:80"  # Cambia 80 por 8080
```
Luego accede a `http://localhost:8080`

### Verificar que Docker Desktop está corriendo

En Windows, asegúrate de que Docker Desktop esté abierto y corriendo. Puedes verificarlo ejecutando:
```bash
docker --version
docker ps
```

## Base de Datos

El proyecto usa SQLite como base de datos, que se crea automáticamente en:
```
Back/database/database.sqlite
```

Las migraciones se ejecutan automáticamente al iniciar el contenedor backend.

## Variables de Entorno

Las variables de entorno están configuradas en `docker-compose.yml`. Los valores importantes son:

- **APP_URL**: `http://localhost`
- **FRONTEND_URL**: `http://localhost`
- **DB_CONNECTION**: `sqlite`

## Notas Adicionales

- La primera vez que se inicia el proyecto, el backend ejecutará migraciones y configuración inicial
- Los archivos de storage de Laravel están montados como volúmenes para persistencia
- El proyecto está configurado para reiniciarse automáticamente (`restart: unless-stopped`)

## Soporte

Si encuentras problemas no listados aquí, revisa:
1. Los logs de los contenedores: `docker logs <nombre_contenedor>`
2. El estado de Docker: `docker ps -a`
3. Los archivos de configuración en `docker/`

---

**¡Listo!** Tu aplicación debería estar corriendo en `http://localhost`
