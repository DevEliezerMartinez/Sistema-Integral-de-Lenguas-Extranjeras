<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\Solicitudes;
use App\Http\Controllers\UserController;
use App\Http\Controllers\notificacions;
use App\Http\Controllers\CalificacionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas (no requieren autenticación)
Route::post('/login', [AuthController::class, 'login']); // Iniciar sesión
Route::post('/register', [AuthController::class, 'registrar']); // Registro de usuario
Route::get('/test', [AuthController::class, 'test']); // Registro de usuario

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
  // Gestión de usuarios
  Route::get('/users', [UserController::class, 'index']); // Obtener lista de usuarios
  Route::get('/infoUser/{id}', [UserController::class, 'show']); // Obtener lista de usuarios
  Route::put('/updateUser/{id}', [UserController::class, 'update']);
  Route::get('/users/notificaciones/{id}', [notificacions::class, 'show']); // Eliminar notificación por ID
  Route::delete('/users/notificaciones/{id}', [notificacions::class, 'destroy']); // Eliminar notificación por ID

  // Cerrar sesión
  Route::post('/logout', [AuthController::class, 'logout']); // Cerrar sesión del usuario

  // Gestión de cursos
  Route::get('/cursos', [CursoController::class, 'index']); // Obtener lista de cursos disponibles
  Route::get('/cursosArchivados', [CursoController::class, 'showArchived']); // Obtener lista de cursos archivados
  Route::get('/cursos/{id}', [CursoController::class, 'show']); // Obtener detalles de un curso específico por ID
  Route::get('/infocurso_alumno/{id}/{alumno}', [CursoController::class, 'showInfobyStudent']); // Obtener detalles de un curso específico por ID
  Route::post('/archivarCurso/{id}', [CursoController::class, 'ArchiveCourse']); // Archivar un curso específico por ID
  Route::post('/desarchivarCurso/{id}', [CursoController::class, 'UnArchiveCourse']); // Desrchivar un curso específico por ID
  Route::get('/cursos_activos', [CursoController::class, 'active']); // Obtener lista de cursos activos
  Route::post('/crear_curso', [CursoController::class, 'create']); // Crear un nuevo curso
  Route::get('/cursos_con_estudiantes', [CursoController::class, 'getCursosConEstudiantes']);


  // Gestión de docentes
  Route::get('/docentes', [DocenteController::class, 'show']); // Obtener lista de docentes
  Route::get('/cursosAsignados/{docenteId}', [DocenteController::class, 'showCursos']); // Obtener lista de docentes 
  Route::get('/cursosArchivados/{docenteId}', [DocenteController::class, 'showCursosArchivadosDocente']); // Obtener lista de docentes 
  Route::delete('/docentes/{docenteId}', [DocenteController::class, 'delete']); // Eliminar un docente por ID


  // Gestión de alumnos
  Route::get('/estudiante/{id}', action: [EstudianteController::class, 'show']); // Obtener lista de docentes
  Route::get('/estudiante/{id}/cursos', [CursoController::class, 'cursosDeAlumno']); // Obtener cursos de un estudiante por ID
  Route::get('/progreso/estudiante/{id}', [CursoController::class, 'ProgresoEstudiante']); // Obtener cursos Archivados o en progreso



  // Gestión de solicitudes
  Route::get('/solicitudes', [Solicitudes::class, 'show']); // Obtener lista de solicitudes
  Route::get('/solicitudes/{cursoId}', [Solicitudes::class, 'showByCurso']); // Obtener solicitudes por ID de curso aceptados
  Route::post('/crear_solicitud', [Solicitudes::class, 'create']); // Crear una nueva solicitud
  Route::post('/solicitudes/{solicitud_id}/rechazar', [Solicitudes::class, 'rechazar']); // Rechazar una solicitud específica por ID
  Route::post('/solicitudes/{solicitud_id}/aceptar', [Solicitudes::class, 'aceptar']); // Aceptar una solicitud específica por ID





  // Rutas para gestionar calificaciones
  Route::post('/calificaciones', [CalificacionController::class, 'store']); // Crear una nueva calificación
  Route::get('/calificaciones/{cursoId}', [CalificacionController::class, 'index']); // Obtener calificaciones de un curso específico





  // Opcional: Rutas relacionadas con estudiantes (descomentarlas si es necesario)
  // Route::get('/estudiantes', [EstudianteController::class, 'index']); // Obtener lista de estudiantes
  // Route::get('/estudiantes/{id}', [EstudianteController::class, 'show']); // Obtener detalles de un estudiante específico por ID
});
