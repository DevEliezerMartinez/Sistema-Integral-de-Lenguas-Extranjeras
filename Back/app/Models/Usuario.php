<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = ['nombre', 'apellidos', 'correo_electronico', 'contrasena', 'genero', 'telefono', 'curp', 'domicilio', 'tipo_usuario'];

    public function coordinador()
    {
        return $this->hasOne(Coordinador::class);
    }

    public function docente()
    {
        return $this->hasOne(Docente::class);
    }

    public function estudiante()
    {
        return $this->hasOne(Estudiante::class);
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class);
    }
}
