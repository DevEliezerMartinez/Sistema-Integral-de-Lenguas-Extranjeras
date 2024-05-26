<?php

use App\Http\Controllers\AuthController;

use App\Http\Controllers\CursoController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/useeer', [UserController::class, 'index']);

    //Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    //Cursos
    Route::get('/cursosDisponibles', [CursoController::class, 'index']);
    Route::get('/Cursos/{id}', [CursoController::class, 'show']);



});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'registrar']);