<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Solicitud;
use App\Models\Notificacion;
use App\Models\Curso;

class Solicitudes extends Controller
{public function show()
    {
        try {
            // Obtener todas las solicitudes con estado "Pendiente" y la información del curso, alumno, y usuario asociado
            $solicitudes = Solicitud::where('status', 'Pendiente')
                ->with(['curso.docente.usuario', 'alumno.usuario']) // Cargar las relaciones necesarias
                ->get();
    
            // Verificar si hay solicitudes pendientes
            if ($solicitudes->isEmpty()) {
                return response()->json([
                    'success' => true, 
                    'message' => 'No se encontraron solicitudes pendientes', 
                    'solicitudes' => []
                ], 200);
            }
    
            // Mapear la respuesta con los datos correctos
            $solicitudes = $solicitudes->map(function ($solicitud) {
                return [
                    'ID_Inscripcion' => $solicitud->id ?? 'No disponible',
                    'Nombre_Alumno' => $solicitud->alumno && $solicitud->alumno->usuario ? $solicitud->alumno->usuario->nombre : 'No disponible',
                    'Apellidos_Alumno' => $solicitud->alumno && $solicitud->alumno->usuario ? $solicitud->alumno->usuario->apellidos : 'No disponible',
                    'Nombre_Curso' => $solicitud->curso->nombre ?? 'No disponible',
                    'Fecha_Inicio_Curso' => $solicitud->curso->fecha_inicio ?? 'No disponible',
                    'Fecha_Fin_Curso' => $solicitud->curso->fecha_fin ?? 'No disponible',
                    'Docente_Curso' => $solicitud->curso->docente ? $solicitud->curso->docente->usuario->nombre : 'No disponible', 
                    'Nivel_Curso' => $solicitud->curso->nivel ?? 'No disponible',
                    'Modalidad_Curso' => $solicitud->curso->modalidad ?? 'No disponible',
                    'Fecha_Inscripcion' => $solicitud->fecha_inscripcion ?? 'No disponible',
                    'Estado_Solicitud' => $solicitud->status ?? 'No disponible',
                    'PDF_Solicitud' => $solicitud->pdf ?? 'No disponible',
                ];
            });
    
            // Retornar respuesta con los datos de las solicitudes
            return response()->json([
                'success' => true, 
                'solicitudes' => $solicitudes
            ], 200);
    
        } catch (\Exception $e) {
            // Capturar cualquier excepción y devolver un error 500 con el mensaje de la excepción
            return response()->json([
                'success' => false, 
                'error' => 'Error en el servidor: ' . $e->getMessage()
            ], 500);
        }
    }
    







    public function showByCurso($cursoId)
    {
        try {
            // Obtener las solicitudes del curso especificado con estado "aceptada"
            $solicitudes = Solicitud::where('curso_id', $cursoId)
                ->where('status', 'Aceptada')
                ->with(['curso', 'alumno']) // Asegúrate de incluir la relación alumno
                ->get();
    
            if ($solicitudes->isEmpty()) {
                return response()->json(['error' => 'No se encontraron solicitudes aceptadas para este curso'], 404);
            }
    
            // Mapear la respuesta con los datos correctos
            $solicitudes = $solicitudes->map(function ($solicitud) {
                return [
                    'ID_Inscripcion' => $solicitud->id ?? 'No disponible',
                    'alumno_id' => $solicitud->alumno->id ?? 'No disponible', // Agregar el ID del alumno
                    'Nombre_Alumno' => $solicitud->alumno->usuario->nombre ?? 'No disponible',
                    'Apellidos_Alumno' => $solicitud->alumno->usuario->apellidos ?? 'No disponible',
                    'Nombre_Curso' => $solicitud->curso->nombre ?? 'No disponible',
                    'Fecha_Inscripcion' => $solicitud->fecha_inscripcion ?? 'No disponible',
                    'Estado_Solicitud' => $solicitud->status ?? 'No disponible',
                    'PDF_Solicitud' => $solicitud->pdf ?? 'No disponible',
                ];
            });
    
            return response()->json($solicitudes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en el servidor: ' . $e->getMessage()], 500);
        }
    }
    


    //Rechazar solicitud
    public function rechazar(Request $request, $solicitud_id)
    {
        // Buscar la solicitud por ID
        $solicitud = Solicitud::find($solicitud_id);

        // Verificar si la solicitud existe
        if (!$solicitud) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        // Actualizar el estado de la solicitud a "Rechazada"
        $solicitud->status = 'Rechazada';

        // Guardar el motivo de rechazo (opcional)
        if ($request->has('motivo')) {
            $solicitud->notas = $request->input('motivo');
        }

        $solicitud->save();

        // Obtener el estudiante asociado a la solicitud
        $estudiante = $solicitud->alumno;

        // Enviar notificación al estudiante (opcional)
        /* if ($estudiante) {
            // Notificar al estudiante
            Notification::send($estudiante, new SolicitudRechazadaNotification($solicitud));
        }
 */
        // Responder con éxito
        return response()->json([
            'mensaje' => 'La solicitud ha sido rechazada exitosamente.',
            'success' => true,
        ], 200);
    }

    public function aceptar(Request $request, $solicitud_id)
    {
        // Buscar la solicitud por ID
        $solicitud = Solicitud::find($solicitud_id);

        // Verificar si la solicitud existe
        if (!$solicitud) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        // Actualizar el estado de la solicitud a "Aprobada"
        $solicitud->status = 'Aprobada';

        // Guardar la solicitud (puedes añadir lógica adicional si es necesario)
        $solicitud->save();

        // Obtener el estudiante asociado a la solicitud
        $estudiante = $solicitud->alumno;

        // Enviar notificación al estudiante (opcional)
       /*  if ($estudiante) {
            // Notificar al estudiante
            Notification::send($estudiante, new SolicitudAprobadaNotification($solicitud));
        } */

        // Responder con éxito
        return response()->json([
            'mensaje' => 'La solicitud ha sido aprobada exitosamente.',
            'success' => true,
        ], 200);
    }




    public function create(Request $request)
    {
        try {
            // Validar la entrada
            $validatedData = $request->validate([
                'curso_id' => 'required|exists:cursos,id',
                'alumno_id' => 'required|integer', // Cambiar esto para depurar

                'fecha_solicitud' => 'nullable|date',
                'detalles' => 'nullable|string',
                'prioridad' => 'nullable|string',
            ]);

            // Buscar el curso por ID
            $curso = Curso::findOrFail($validatedData['curso_id']);

            // Crear una nueva solicitud
            $solicitud = new Solicitud();
            $solicitud->curso_id = $validatedData['curso_id'];
            $solicitud->alumno_id = $validatedData['alumno_id'];
            $solicitud->status = 'Pendiente';
            $solicitud->fecha_inscripcion = $validatedData['fecha_inscripcion'] ?? now();
            $solicitud->save();

            return response()->json([
                'message' => 'Solicitud creada exitosamente',
                'solicitud' => $solicitud,
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Curso no encontrado.',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al crear la solicitud.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
