<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    use HasFactory;

    protected $fillable = ['usuario_id', 'carrera', 'numero_control', 'historial_cursos', 'perfil'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function calificaciones()
    {
        return $this->hasMany(Calificaciones::class);
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }

    public function constancias()
    {
        return $this->hasMany(Constancias::class);
    }
}
