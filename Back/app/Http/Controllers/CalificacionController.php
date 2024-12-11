<?php

namespace App\Http\Controllers;

use App\Models\Calificaciones; // Asegúrate de importar el modelo
use App\Models\Estudiante;
use App\Models\Notificacion;
use App\Models\Usuario;
use Illuminate\Http\Request;

class CalificacionController extends Controller
{


    // Método para obtener las calificaciones finales de un curso con los alumnos correspondientes
    public function calificacionesFinales($cursoId)
    {
        try {
            // Obtener las calificaciones relacionadas con el curso, cargar los datos del alumno, su usuario relacionado y el curso
            $calificaciones = Calificaciones::with(['alumno.usuario', 'curso']) // Cargar los datos del alumno, su usuario y el curso relacionado
                ->where('curso_id', $cursoId)
                ->get();
    
            // Verificar si existen calificaciones para el curso
            if ($calificaciones->isEmpty()) {
                return response()->json(['error' => 'No se encontraron calificaciones para el curso'], 404);
            }
    
            // Transformar los resultados para enviar nombre completo, calificación y detalles del curso
            $result = $calificaciones->map(function ($calificacion) {
                return [
                    'nombre_completo' => $calificacion->alumno->usuario->nombre . ' ' . $calificacion->alumno->usuario->apellidos,  // Concatenar nombre y apellidos
                    'calificacion' => $calificacion->calificacion,  // Calificación del alumno
                    'numero_control' => $calificacion->alumno->numero_control,
                    'curso' => [  // Detalles del curso
                        'nombre' => $calificacion->curso->nombre,
                        'descripción' => $calificacion->curso->descripcion,
                        'modalidad' => $calificacion->curso->modalidad,
                        'nivel' => $calificacion->curso->nivel,
                        'estado' => $calificacion->curso->estado,
                        'fecha_inicio' => $calificacion->curso->fecha_inicio,
                        'fecha_fin' => $calificacion->curso->fecha_fin,
                        'horario' => $calificacion->curso->horario,
                    ],
                ];
            });
    
            // Retornar los resultados en formato JSON
            return response()->json($result);
        } catch (\Exception $e) {
            // Capturar cualquier error y retornar una respuesta de error
            return response()->json([
                'error' => 'Ocurrió un error al obtener las calificaciones',
                'message' => $e->getMessage(),
            ], 500);  // Código de estado 500 para errores del servidor
        }
    }
    


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
            // Verificar si la calificación puede ser editada
            if (!$calificacion->editable) {
                return response()->json([
                    'error' => 'La calificación ya no se puede editar.'
                ], 403);
            }

            // Si la calificación puede editarse, actualizarla
            $calificacion->calificacion = $validatedData['calificacion'];
            $calificacion->editable = false; // Marcar como no editable después de la primera edición
            $calificacion->save();

            // Generar notificación para el alumno sobre la actualización de su calificación
            if ($alumno) {
                Notificacion::create([
                    'usuario_id' => $alumno->usuario_id,
                    'mensaje' => "Se ha actualizado tu calificación para el curso '{$validatedData['curso_id']}' a: {$validatedData['calificacion']}.",
                    'fecha_notificacion' => now(),
                    'estado' => 'No leída',
                ]);
            }

            // Generar notificaciones para los coordinadores
            $coordinadores = Usuario::where('tipo_usuario', 'coordinador')->get();
            foreach ($coordinadores as $coordinador) {
                Notificacion::create([
                    'usuario_id' => $coordinador->id,
                    'mensaje' => "La calificación del alumno con ID '{$validatedData['alumno_id']}' en el curso '{$validatedData['curso_id']}' ha sido actualizada a: {$validatedData['calificacion']}.",
                    'fecha_notificacion' => now(),
                    'estado' => 'No leída',
                ]);
            }

            // Retornar la calificación actualizada
            return response()->json($calificacion, 200);
        } else {
            // Si no existe, crear una nueva calificación
            $validatedData['editable'] = true; // Nueva calificación es editable por defecto
            $calificacion = Calificaciones::create($validatedData);

            // Generar notificación para el alumno sobre la asignación de su calificación
            if ($alumno) {
                Notificacion::create([
                    'usuario_id' => $alumno->usuario_id,
                    'mensaje' => "Se te ha asignado una nueva calificación para el curso '{$validatedData['curso_id']}': {$validatedData['calificacion']}.",
                    'fecha_notificacion' => now(),
                    'estado' => 'No leída',
                ]);
            }

            // Generar notificaciones para los coordinadores
            $coordinadores = Usuario::where('tipo_usuario   ', 'coordinador')->get();
            foreach ($coordinadores as $coordinador) {
                Notificacion::create([
                    'usuario_id' => $coordinador->id,
                    'mensaje' => "Se ha asignado una nueva calificación al alumno con ID '{$validatedData['alumno_id']}' en el curso '{$validatedData['curso_id']}': {$validatedData['calificacion']}.",
                    'fecha_notificacion' => now(),
                    'estado' => 'No leída',
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



    // Método para desactivar las calificaciones de un curso específico
    public function desactivar(Request $request)
    {
        try {
            // Obtener el ID del curso desde la solicitud
            $cursoId = $request->input('curso_id');

            // Verificar si el curso existe
            $calificaciones = Calificaciones::where('curso_id', $cursoId);

            if ($calificaciones->exists()) {
                // Desactivar las calificaciones (establecer editable en false)
                $calificaciones->update(['editable' => false]);

                return response()->json([
                    'message' => 'Las calificaciones del curso han sido desactivadas correctamente.'
                ], 200);
            }

            return response()->json([
                'error' => 'No se encontraron calificaciones para el curso.'
            ], 404);
        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json([
                'error' => 'Hubo un problema al desactivar las calificaciones del curso. Intenta de nuevo.'
            ], 500);
        }
    }
}
