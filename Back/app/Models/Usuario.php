<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'nombre', 'apellidos', 'correo_electronico', 'contrasena', 'genero', 
        'telefono', 'curp', 'domicilio', 'tipo_usuario'
    ];

    // Relación con Coordinador
    public function coordinador()
    {
        return $this->hasOne(Coordinador::class);
    }

    // Relación con Docente
    public function docente()
    {
        return $this->hasOne(Docente::class);
    }

    // Relación con Estudiante
    public function estudiante()
    {
        return $this->hasOne(Estudiante::class);
    }

    // Relación con Notificación
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class);
    }
}
