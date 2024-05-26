<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripción', 'nivel', 'estado', 'maestro_id', 'coordinador_id'];

    public function maestro()
    {
        return $this->belongsTo(Docente::class);
    }

    public function coordinador()
    {
        return $this->belongsTo(Coordinador::class);
    }

    public function calificaciones()
    {
        return $this->hasMany(Calificaciones::class);
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }
}
