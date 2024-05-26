<?php

use App\Http\Controllers\AuthController;

use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/useeer', [UserController::class, 'index']);
});

Route::post('/register', [AuthController::class, 'registrar']);
Route::post('/login', [AuthController::class, 'login']);