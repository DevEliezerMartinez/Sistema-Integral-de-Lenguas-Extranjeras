# Backend - Sistema de Gestión de Lenguas Extranjeras

Este es el backend del Sistema de Gestión de Lenguas Extranjeras, construido con **Laravel 11** y **PHP 8.2**. Actúa como una API RESTful robusta para manejar la lógica de negocio, autenticación avanzada y persistencia de datos del TecNM Campus San Marcos.

## 🚀 Tecnologías

- **Framework:** Laravel 11
- **Lenguaje:** PHP 8.2
- **Autenticación:** Laravel Sanctum (Basada en Cookies/Sesión)
- **Base de Datos:** SQLite (Desarrollo y Producción Local)
- **Validación:** Form Requests & Custom Validators
- **Middleware:** Web & Sanctum Auth

## 🛠️ Instalación Local

Para ejecutar el backend de manera aislada:

1. **Dependencias:** `composer install`
2. **Entorno:** `cp .env.example .env` (Ajustar `APP_URL` y `FRONTEND_URL`)
3. **Clave:** `php artisan key:generate`
4. **Base de datos:** `touch database/database.sqlite`
5. **Migraciones:** `php artisan migrate --seed`
6. **Servidor:** `php artisan serve`

---

## ⚙️ Configuración del Entorno (.env)

El archivo `.env` es crucial para la comunicación entre el backend y el frontend. Aquí se explican las variables clave:

### Aplicación y URLs

- `APP_URL`: La URL base de la API (por defecto `http://localhost:8000`).
- `FRONTEND_URL`: La URL donde corre tu frontend (ej: `http://localhost:5173`). Es vital para que el sistema permita peticiones desde el navegador (CORS).
- `SANCTUM_STATEFUL_DOMAINS`: Dominios que pueden realizar peticiones con estado (cookies). Debe incluir el host y puerto del frontend.

### Base de Datos

- `DB_CONNECTION`: Por defecto es `sqlite`.
- **Nota:** Si usas SQLite, asegúrate de que el archivo `database/database.sqlite` exista.

### Sesión y Seguridad

- `SESSION_DRIVER`: Define cómo se guardan las sesiones. En desarrollo se suele usar `file`.
- `APP_KEY`: Clave única de encriptación generada con `php artisan key:generate`. No compartas esta clave.

### Mail y Logs

- `MAIL_MAILER`: Configurado como `log` por defecto para que los correos "enviados" aparezcan en los logs de Laravel (`storage/logs/laravel.log`) en lugar de enviarse realmente.

---

## 💻 Comandos Frecuentes

Aquí tienes los comandos más utilizados durante el desarrollo:

### Gestión de Base de Datos

```bash
# Ejecutar migraciones
php artisan migrate

# Reiniciar base de datos y ejecutar seeders (CUIDADO: Borra datos)
php artisan migrate:fresh --seed

# Crear una nueva migración
php artisan make:migration create_nombre_tabla_table

# Crear un seeder
php artisan make:seed NombreSeeder
```

### Caché y Optimización

```bash
# Limpiar toda la caché (Config, Rutas, Vistas)
php artisan optimize:clear

# Ver lista de rutas registradas
php artisan route:list

# Abrir consola interactiva de Laravel (Tinker)
php artisan tinker
```

### Desarrollo y Testing

```bash
# Ejecutar pruebas unitarias/integración
php artisan test

# Crear un nuevo controlador
php artisan make:controller NombreController
```

---

## 🔐 Autenticación y Login

El sistema utiliza **Laravel Sanctum** configurado para autenticación SPA basada en cookies (`middleware: web`). Esto garantiza que la sesión sea segura y persistente.

### Proceso de Login (`AuthController@login`)

El login no solo verifica las credenciales, sino que también valida el **rol de acceso**:

1. **Validación:** Se requiere `correo_electronico` y `contrasena`.
2. **Tipo de Acceso:** Se puede enviar un `tipo_acceso` (`accesoDocente`, `accesoCoordinador`, `accesoEstudiante`).
3. **Verificación de Rol:** El sistema busca si el usuario tiene el perfil correspondiente en las tablas `docentes`, `coordinadores` o `estudiantes`.
4. **Respuesta:** Devuelve los datos del usuario y el objeto específico de su rol (ej: datos de estudiante).

---

## 🛣️ Guía de Rutas (API)

Todas las rutas de la API están definidas en `routes/api.php`. La mayoría requieren el middleware `auth:sanctum`.

### 🔓 Rutas Públicas

- `POST /api/login`: Inicia sesión y genera cookie de sesión.
- `POST /api/register`: Registra un nuevo usuario indicando su tipo.
- `GET /api/test`: Endpoint de verificación de estado.

### 🔒 Rutas Protegidas (Requieren Login)

#### 👤 Usuarios y Perfil

- `GET /api/users`: Lista de todos los usuarios.
- `GET /api/infoUser/{id}`: Detalle completo de un usuario.
- `PUT /api/updateUser/{id}`: Actualizar información de perfil.
- `DELETE /api/users/notificaciones/{id}`: Gestionar notificaciones del sistema.

#### 📚 Gestión de Cursos

- `GET /api/cursos`: Cursos disponibles.
- `POST /api/crear_curso`: Crear un nuevo curso (Solo personal autorizado).
- `POST /api/archivarCurso/{id}`: Mover curso al histórico.
- `GET /api/cursos_con_estudiantes`: Listado avanzado de cursos y su población.

#### 👨‍🏫 Docentes

- `GET /api/docentes`: Lista de docentes activos.
- `GET /api/cursosAsignados/{docenteId}`: Cursos vinculados a un docente específico.
- `DELETE /api/docentes/{id}`: Dar de baja a un docente.

#### 🎓 Estudiantes

- `GET /api/estudiante/{id}/cursos`: Historial académico del alumno.
- `GET /api/progreso/estudiante/{id}`: Cursos en curso y archivados.

#### 📝 Solicitudes (Inscripción/Trámites)

- `GET /api/solicitudes`: Ver todas las solicitudes pendientes.
- `POST /api/crear_solicitud`: Enviar una nueva solicitud.
- `POST /api/solicitudes/{id}/aceptar`: Aprobar solicitud.
- `POST /api/solicitudes/{id}/rechazar`: Denegar solicitud.

#### 📊 Calificaciones

- `POST /api/calificaciones`: Registrar o actualizar notas.
- `GET /api/calificaciones/{cursoId}`: Consultar actas de un curso.

---

## 📂 Estructura del Código

- `app/Http/Controllers/`: Lógica de los endpoints.
- `app/Models/`: Definición de esquemas de datos (Usuario, Estudiante, etc.).
- `database/migrations/`: Estructura de la base de datos SQL.
- `routes/api.php`: Definición central de la API.
