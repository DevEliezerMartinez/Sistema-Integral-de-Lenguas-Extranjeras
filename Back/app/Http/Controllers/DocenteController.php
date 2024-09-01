<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    // Método para retornar la lista de docentes con su ID y nombre del usuario
    public function show()
    {
        // Obtener todos los docentes con la información del usuario asociado
            $docentes = Docente::join('usuarios', 'docentes.usuario_id', '=', 'usuarios.id')
                ->select('docentes.id', 'usuarios.nombre')
                ->get();

            // Retornar los docentes como respuesta JSON
            return response()->json(['docentes' => $docentes]);
    }
}
