<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripción',
        'modalidad',
        'nivel',
        'estado',
        'maestro_id',
        'coordinador_id',
        'fecha_inicio',
        'fecha_fin',
        'horario',
    ];
    
    // Relación con el modelo Docente
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'maestro_id');
    }
    

    public function coordinador()
    {
        return $this->belongsTo(Coordinador::class, 'coordinador_id');
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
