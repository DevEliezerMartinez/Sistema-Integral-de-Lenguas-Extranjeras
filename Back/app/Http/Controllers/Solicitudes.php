<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Solicitud;
use App\Models\Notificacion;
use App\Models\Curso;

class Solicitudes extends Controller
{
    public function show()
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
    
        // Enviar notificación al estudiante con el motivo de rechazo
        if ($estudiante) {
            // Notificar al estudiante
            Notificacion::create([
                'usuario_id' => $estudiante->usuario_id, // ID del usuario asociado al estudiante
                'mensaje' => "Tu solicitud ha sido rechazada. Motivo: {$solicitud->notas}", // Incluye el motivo de rechazo
                'fecha_notificacion' => now(), // Fecha actual
                'estado' => 'No leída', // Establecer el estado de la notificación
            ]);
        }
    
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

        // Obtener el estudiante asociado a la solicitud
        $estudiante = $solicitud->alumno;

        // Verificar si el estudiante existe
        if (!$estudiante) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        }

        // Obtener el usuario asociado al estudiante
        $usuario = $estudiante->usuario; // Asumiendo que tienes una relación en el modelo Estudiante

        // Actualizar el estado de la solicitud a "Aceptada"
        $solicitud->status = 'Aceptada';
        $solicitud->save(); // Guardar la solicitud

        // Obtener el curso asociado a la solicitud
        $curso = $solicitud->curso; // Asegúrate de que tengas una relación en el modelo Solicitud

        // Generar la notificación
        if ($usuario) {
            Notificacion::create([
                'usuario_id' => $usuario->id, // ID del usuario asociado al estudiante
                'mensaje' => "Tu solicitud para el curso '{$curso->nombre}' ha sido aprobada exitosamente.", // Incluye el nombre del curso
                'fecha_notificacion' => now(), // Fecha actual
                'estado' => 'No leída', // Establecer el estado de la notificación
            ]);
        }

        // Responder con éxito
        return response()->json([
            'mensaje' => 'La solicitud ha sido aprobada exitosamente.',
            'success' => true,
        ], 200);
    }






    public function create(Request $request)
    {
        // Validación de los campos
        try {
            $validated = $request->validate([
                'curso_id' => 'required|exists:cursos,id',
                'alumno_id' => 'required|exists:estudiantes,id',
                'fecha_inscripcion' => 'required|date',
                'file' => 'required|file|mimes:pdf|max:2048', // Asegúrate de permitir solo PDFs
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retornar los errores de validación
            return response()->json([
                'message' => 'Errores de validación.',
                'errors' => $e->validator->errors(),
                'success' => false,
            ], 422);
        }

        // Verificar si ya existe una solicitud pendiente o aceptada para el mismo curso y alumno
        $existingSolicitud = Solicitud::where('curso_id', $validated['curso_id'])
            ->where('alumno_id', $validated['alumno_id'])
            ->whereIn('status', ['Pendiente', 'Aceptada'])
            ->first();

        if ($existingSolicitud) {
            return response()->json([
                'message' => 'Ya existe una solicitud Pendiente o Aceptada para este curso.',
                'success' => false,
            ], 409); // Conflicto
        }

        // Manejar la carga del archivo
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // Crear un nombre de archivo único usando solo el ID del estudiante
            $fileName = 'alumno_' . $validated['alumno_id'] . '_curso_' . $validated['curso_id'] . '_' . date('Ymd', strtotime($validated['fecha_inscripcion'])) . '.pdf';

            try {
                // Guardar el archivo con el nuevo nombre en la carpeta 'pdfs'
                $filePath = $file->storeAs('pdfs', $fileName, 'public');

                // Crear la solicitud con la ruta del archivo
                $solicitud = Solicitud::create([
                    'curso_id' => $validated['curso_id'],
                    'alumno_id' => $validated['alumno_id'],
                    'status' => "Pendiente",
                    'fecha_inscripcion' => $validated['fecha_inscripcion'],
                    'pdf' => $filePath, // Guarda la ruta en la columna 'pdf'
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                return response()->json([
                    'success' => true, // Indica que la solicitud se creó con éxito
                    'solicitud' => $solicitud // Puedes incluir los datos de la solicitud si es necesario
                ], 201);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Ocurrió un error al crear la solicitud.',
                    'error' => $e->getMessage(),
                    'input' => $request->all(), // Mostrar los datos que se estaban intentando procesar
                    'success' => false,
                ], 500);
            }
        }

        return response()->json(['message' => 'No se recibió ningún archivo.', 'success' => false], 400);
    }
}
