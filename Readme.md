# Sistema de Gestión de Lenguas Extranjeras

Este proyecto implementa un Sistema de Información para la Gestión de Lenguas Extranjeras destinado a la Coordinación de Lenguas Extranjeras del Tecnológico Nacional de México Campus San Marcos.

## Descripción

El sistema está diseñado para optimizar procesos administrativos y académicos, mejorando la eficiencia operativa y ofreciendo un seguimiento detallado del progreso académico. El proyecto abarca desde la investigación y análisis de requerimientos hasta la implementación y despliegue de la plataforma.

## Tecnologías Utilizadas

Este proyecto está diseñado como una SPA (Single Page Application) que utiliza una arquitectura RESTful. En lugar de realizar renderizado del lado del servidor, la aplicación solicita y maneja datos en formato JSON.

- **Backend:** Laravel
- **Frontend:** React

## Objetivos

- **Optimización de procesos administrativos:** Facilitar la gestión y coordinación de cursos de lenguas extranjeras.
- **Mejora en la eficiencia operativa:** Reducir errores y aumentar la eficacia en la administración de los cursos.
- **Seguimiento académico:** Proveer un sistema detallado de seguimiento del progreso de los estudiantes.

## Alcance

El sistema está exclusivamente diseñado para satisfacer las necesidades de la Coordinación de Lenguas Extranjeras del TecNM Campus San Marcos.

## Requisitos Previos

- **Docker Desktop** instalado y ejecutándose.
- **Git** (opcional, para clonar el repositorio).

## Instalación y Despliegue

Sigue estos pasos para poner en marcha la aplicación en un entorno de producción local o servidor.

### 1. Configuración de IP

La aplicación necesita saber en qué dirección IP se está ejecutando para conectar el Frontend con el Backend.

1.  Abre una terminal y ejecuta `ipconfig` (Windows) o `ifconfig` (Mac/Linux) para obtener tu dirección IP local (ej. `192.168.1.100`).
2.  Abre el archivo `docker-compose.prod.yml`.
3.  Actualiza las siguientes líneas con tu IP:
    - En el servicio `backend`:
      - `FRONTEND_URL=http://TU_IP`
      - `SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,TU_IP`
    - En el servicio `web`:
      - `args: - VITE_API_URL=http://TU_IP`

### 2. Preparar la Base de Datos

El archivo de base de datos no se incluye en el repositorio por seguridad. Debes crearlo manualmente.

1.  Ve a la carpeta `Back/database`.
2.  Crea un archivo vacío llamado `database.sqlite`.

### 3. Iniciar la Aplicación

Ejecuta el siguiente comando en la raíz del proyecto para construir y levantar los contenedores:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### 4. Inicializar Datos

Una vez que los contenedores estén corriendo, ejecuta estos comandos para crear las tablas y datos iniciales:

```bash
# Crear tablas
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force

# Insertar datos de prueba (Seeders)
docker-compose -f docker-compose.prod.yml exec backend php artisan db:seed --force
```

La aplicación estará disponible en `http://TU_IP` o `http://localhost`.

---

## Mover la Aplicación a Otra PC

Si necesitas mover el sistema a otra computadora y conservar los datos:

1.  **Copiar Archivos**: Copia toda la carpeta del proyecto a la nueva PC.
2.  **Copiar Base de Datos**: Asegúrate de copiar manualmente el archivo `Back/database/database.sqlite` de la PC anterior a la misma ubicación en la nueva.
3.  **Copiar Archivos Subidos**: Si hay archivos subidos por usuarios, copia la carpeta `Back/storage/app/public`.
4.  **Configurar IP**: Repite el paso 1 de "Instalación" con la IP de la nueva PC.
5.  **Iniciar**: Ejecuta el comando de `docker-compose up --build -d`.
    - **Nota**: NO ejecutes `migrate` ni `db:seed` si quieres conservar tus datos anteriores.

---

## Solución de Problemas

- **Error 500 al iniciar sesión**: Verifica que el archivo `database.sqlite` exista en la carpeta `Back/database` y que hayas ejecutado las migraciones.
- **Error de CORS**: Si cambiaste de red o IP, asegúrate de haber actualizado `docker-compose.prod.yml` y reconstruido los contenedores (`up --build`).

---

## Créditos

**Autor:** Eliezer Solano Martinez
**Institución:** Tecnológico Nacional de México, Campus San Marcos
