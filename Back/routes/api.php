<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\Solicitudes;
use App\Http\Controllers\UserController;
use App\Http\Controllers\notificacions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'registrar']);

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Usuarios
    Route::get('/users', [UserController::class, 'index']); // Corrección: 'useeer' -> 'users'
    Route::get('/users/notificaciones/{id}', [notificacions::class, 'show']); // Corrección: 'useeer' -> 'users'

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cursos
    Route::get('/cursos', [CursoController::class, 'index']); // Corrección: 'cursosDisponibles' -> 'cursos'
    Route::get('/cursosArchivados', [CursoController::class, 'showArchived']); // Cursos Archivados
    Route::get('/cursos/{id}', [CursoController::class, 'show']); // Corrección: 'Cursos' -> 'cursos'

    //Set curso como Archivadooo
    Route::post('/archivarCurso/{id}', [CursoController::class, 'ArchiveCourse']); // Corrección: 'Cursos' -> 'cursos'

    // Cursos activos
    Route::get('/cursos_activos', [CursoController::class, 'active']); 
    Route::post('/crear_curso', [CursoController::class, 'create']); 



    Route::get('/docentes', [DocenteController::class, 'show']); 
    //Delete
    Route::delete('/docentes/{docenteId}', [DocenteController::class, 'delete']); 



    Route::get('/solicitudes', [Solicitudes::class, 'show']); 
    Route::get('/solicitudes/{cursoId}', [Solicitudes::class, 'showByCurso']);
    Route::post('/crear_solicitud', [Solicitudes::class, 'create']); 
    // Opcional: Estudiantes (si se necesitan rutas relacionadas con estudiantes)
    // Route::get('/estudiantes', [EstudianteController::class, 'index']);
    // Route::get('/estudiantes/{id}', [EstudianteController::class, 'show']);

    //Rechazar solicitud
    Route::post('/solicitudes/{solicitud_id}/rechazar', [Solicitudes::class, 'rechazar']);
    Route::post('/solicitudes/{solicitud_id}/aceptar', [Solicitudes::class, 'aceptar']);
});
