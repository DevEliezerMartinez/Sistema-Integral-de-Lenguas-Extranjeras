<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;

    protected $fillable = ['curso_id', 'alumno_id', 'fecha_inscripcion', 'status', 'pdf'];

    public function alumno()
    {
        return $this->belongsTo(Estudiante::class, 'alumno_id');
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }
}
