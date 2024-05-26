<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Constancias extends Model
{
    use HasFactory;

    protected $fillable = ['curso_id', 'alumno_id', 'fecha_emision', 'constancia'];

    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function alumno()
    {
        return $this->belongsTo(Estudiante::class);
    }
}
