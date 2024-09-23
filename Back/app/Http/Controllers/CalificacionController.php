<?php

namespace App\Http\Controllers;

use App\Models\Calificaciones; // Asegúrate de importar el modelo
use Illuminate\Http\Request;

class CalificacionController extends Controller
{
    // Método para almacenar una nueva calificación
    public function store(Request $request)
    {
        // Validar los datos de la solicitud
        $validatedData = $request->validate([
            'curso_id' => 'required|integer',
            'alumno_id' => 'required|integer',
            'calificacion' => 'required|numeric',
        ]);
    
        // Buscar si la calificación ya existe
        $calificacion = Calificaciones::where('curso_id', $validatedData['curso_id'])
            ->where('alumno_id', $validatedData['alumno_id'])
            ->first();
    
        if ($calificacion) {
            // Si la calificación ya existe, actualizarla
            $calificacion->calificacion = $validatedData['calificacion'];
            $calificacion->save();
    
            // Retornar la calificación actualizada
            return response()->json($calificacion, 200);
        } else {
            // Si no existe, crear una nueva calificación
            $calificacion = Calificaciones::create($validatedData);
            
            // Retornar la calificación creada
            return response()->json($calificacion, 201);
        }
    }
    

    // Método para obtener las calificaciones de un curso específico
    public function index($cursoId)
    {
        // Obtener las calificaciones relacionadas con el curso
        $calificaciones = Calificaciones::where('curso_id', $cursoId)->get();
        
        // Retornar las calificaciones
        return response()->json($calificaciones);
    }
}
