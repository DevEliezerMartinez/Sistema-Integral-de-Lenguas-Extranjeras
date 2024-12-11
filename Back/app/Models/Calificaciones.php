<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calificaciones extends Model
{
    use HasFactory;

    protected $fillable = ['curso_id', 'alumno_id', 'calificacion','editable'];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function alumno()
    {
        return $this->belongsTo(Estudiante::class);
    }
}
