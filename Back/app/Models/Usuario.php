<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    // 🔥 Especificar el nombre de la tabla
    protected $table = 'usuarios';

    protected $fillable = [
        'nombre',
        'apellidos',
        'correo_electronico',
        'contrasena',
        'genero',
        'telefono',
        'curp',
        'domicilio',
        'tipo_usuario'
    ];

    protected $hidden = [
        'contrasena',
        'remember_token',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 🔥 CRÍTICO: Indica a Laravel qué campo usar como contraseña
     */
    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    /**
     * 🔥 Nombre del campo identificador (ID)
     */
    public function getAuthIdentifierName()
    {
        return 'id';
    }

    /**
     * 🔥 Obtener el identificador del usuario
     */
    public function getAuthIdentifier()
    {
        return $this->id;
    }

    // Relaciones
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