# Frontend - Sistema de Gestión de Lenguas Extranjeras

Esta es la aplicación cliente (Frontend) del Sistema de Gestión de Lenguas Extranjeras, construida con **React**, **Vite** y **Ant Design**.

## Requisitos Previos

- **Node.js** (versión 18 o superior recomendada).
- **NPM** (incluido con Node.js).

## Instalación Local

Si deseas ejecutar el frontend de manera aislada (sin Docker) para desarrollo:

1.  Navega a la carpeta del frontend:

    ```bash
    cd Frontend
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

3.  Configura las variables de entorno:
    - Crea un archivo `.env` basado en `.env.example`.
    - Asegúrate de definir `VITE_API_URL` con la URL del backend (ej. `http://localhost:8000`).

4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible generalmente en `http://localhost:5173`.

## Gestión de Rutas

La aplicación utiliza `react-router-dom` para la navegación. Las rutas están organizadas por roles y niveles de acceso:

### Rutas Públicas

- `/`: Inicio (Home).
- `/login`: Inicio de sesión para estudiantes.
- `/Registro`: Registro de nuevos estudiantes.
- `/Recuperar`: Recuperación de contraseña.
- `/Documentacion`: Documentación pública del sistema.

### Estudiantes (Protegidas)

- `/Estudiantes`: Dashboard principal del estudiante.
- `/Estudiantes/Cursos`: Lista de cursos inscritos.
- `/Estudiantes/Cursos/:cursoId`: Detalle y contenido de un curso específico.
- `/Estudiantes/Progreso`: Seguimiento académico.
- `/Estudiantes/Perfil`: Gestión de perfil personal.
- `/Estudiantes/Notificaciones`: Centro de notificaciones.

### Docentes (Protegidas)

- `/LoginDocentes`: Acceso para personal docente.
- `/Docentes`: Dashboard del docente.
- `/Docentes/CursosActivos`: Gestión de grupos actuales.
- `/Docentes/Cursos/:cursoId`: Gestión de alumnos y calificaciones de un curso.
- `/Docentes/CursosArchivados`: Historial de cursos.
- `/Docentes/Perfil`: Información del docente.

### Coordinador (Protegidas)

- `/LoginCoordinador`: Acceso administrativo.
- `/Coordinador`: Panel de control administrativo.
- `/Coordinador/Solicitudes`: Gestión de inscripciones y trámites.
- `/Coordinador/Alumnos`: Directorio de estudiantes.
- `/Coordinador/Alumnos/:AlumnoId`: Expediente detallado del estudiante.
- `/Coordinador/CursosActivos`: Supervisión de la oferta académica.
- `/Coordinador/Cursos/:cursoId`: Supervisión detallada de un curso.

## Autenticación y Seguridad

El sistema utiliza **Laravel Sanctum** para la autenticación basada en cookies (SPA Authentication).

- **AuthContext.jsx**: Gestiona el estado global del usuario y proporciona funciones de `login` y `logout`.
- **Axios Configuration (`src/axios.js`)**: Maneja automáticamente el CSRF token y los reintentos en caso de errores de sesión expirada (419).
- **LocalStorage**: Se utiliza para persistir los datos básicos del usuario y mantener la sesión activa entre recargas.
- **Protected Routes**: El componente `ProtectedRoute` valida que el usuario esté autenticado y tenga el rol necesario para acceder a rutas específicas.

## Estructura del Proyecto

- `src/components/`: Componentes reutilizables divididos por rol (Estudiante, Docente, Coordinador, Shared).
- `src/pages/`: Vistas principales de la aplicación organizadas por carpetas según el tipo de usuario.
- `src/AuthContext.jsx`: Proveedor de contexto para la autenticación.
- `src/axios.js`: Cliente HTTP configurado para interactuar con la API.
- `src/App.jsx`: Definición central de rutas y protectores.

## Construcción para Producción

Para generar los archivos estáticos optimizados:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist`.

## Docker

El entorno de producción utiliza Nginx para servir los archivos estáticos.

- `Dockerfile.prod`: Define los pasos para construir la imagen de producción.
- La orquestación completa se encuentra en el archivo `docker-compose.prod.yml` en la raíz del repositorio.
