<?php

namespace App\Http\Controllers;

use App\Models\Calificaciones; // Asegúrate de importar el modelo
use App\Models\Estudiante;
use App\Models\Notificacion;
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

        // Obtener el alumno para la notificación
        $alumno = Estudiante::find($validatedData['alumno_id']);

        if ($calificacion) {
            // Si la calificación ya existe, actualizarla
            $calificacion->calificacion = $validatedData['calificacion'];
            $calificacion->save();

            // Generar notificación para el alumno sobre la actualización de su calificación
            if ($alumno) {
                Notificacion::create([
                    'usuario_id' => $alumno->usuario_id, // Asegúrate de que `usuario_id` exista en el modelo Alumno
                    'mensaje' => "Se ha actualizado tu calificación para el curso '{$validatedData['curso_id']}' a: {$validatedData['calificacion']}.", // Mensaje de notificación
                    'fecha_notificacion' => now(), // Fecha actual
                    'estado' => 'No leída', // Estado de la notificación
                ]);
            }

            // Retornar la calificación actualizada
            return response()->json($calificacion, 200);
        } else {
            // Si no existe, crear una nueva calificación
            $calificacion = Calificaciones::create($validatedData);

            // Generar notificación para el alumno sobre la asignación de su calificación
            if ($alumno) {
                Notificacion::create([
                    'usuario_id' => $alumno->usuario_id, // Asegúrate de que `usuario_id` exista en el modelo Alumno
                    'mensaje' => "Se te ha asignado una nueva calificación para el curso '{$validatedData['curso_id']}': {$validatedData['calificacion']}.", // Mensaje de notificación
                    'fecha_notificacion' => now(), // Fecha actual
                    'estado' => 'No leída', // Estado de la notificación
                ]);
            }

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
