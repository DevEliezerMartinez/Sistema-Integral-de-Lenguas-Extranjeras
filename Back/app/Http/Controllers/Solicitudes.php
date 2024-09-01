<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Solicitud;
use App\Models\Curso;

class Solicitudes extends Controller
{
    public function show()
    {
        try {
            // Obtener todas las solicitudes con la información del curso y del alumno asociado
            $solicitudes = Solicitud::with(['curso', 'alumno'])->get();

            if ($solicitudes->isEmpty()) {
                return response()->json(['error' => 'No se encontraron solicitudes'], 404);
            }

            $solicitudes = $solicitudes->map(function ($solicitud) {
                return [
                    'ID_Inscripcion' => $solicitud->id ?? 'No disponible',
                    'Nombre_Alumno' => $solicitud->alumno->nombre ?? 'No disponible',
                    'Apellidos_Alumno' => $solicitud->alumno->apellidos ?? 'No disponible',
                    'Nombre_Curso' => $solicitud->curso->nombre ?? 'No disponible',
                    'Fecha_Inscripcion' => $solicitud->fecha_inscripcion ?? 'No disponible',
                    'Estado_Solicitud' => $solicitud->status ?? 'No disponible',
                    'PDF_Solicitud' => $solicitud->pdf ?? 'No disponible'
                ];
            });

            return response()->json($solicitudes);
        } catch (\Exception $e) {
            // Capturar cualquier excepción y devolver un error 500 con el mensaje de la excepción
            return response()->json(['error' => 'Error en el servidor: ' . $e->getMessage()], 500);
        }
    }

    public function showByCurso($cursoId)
    {
        try {
            // Obtener las solicitudes del curso especificado con estado "aceptada"
            $solicitudes = Solicitud::where('curso_id', $cursoId)

                ->with(['curso', 'alumno.usuario']) // Cargar las relaciones necesarias
                ->get();

            if ($solicitudes->isEmpty()) {
                return response()->json(['error' => 'No se encontraron solicitudes aceptadas para este curso'], 404);
            }

            // Mapear la respuesta con los datos correctos
            $solicitudes = $solicitudes->map(function ($solicitud) {
                return [
                    'ID_Inscripcion' => $solicitud->id ?? 'No disponible',
                    'Nombre_Alumno' => $solicitud->alumno->usuario->nombre ?? 'No disponible',
                    'Apellidos_Alumno' => $solicitud->alumno->usuario->apellidos ?? 'No disponible',
                    'Nombre_Curso' => $solicitud->curso->nombre ?? 'No disponible',
                    'Fecha_Inscripcion' => $solicitud->fecha_inscripcion ?? 'No disponible',
                    'Estado_Solicitud' => $solicitud->status ?? 'No disponible',
                    'PDF_Solicitud' => $solicitud->pdf ?? 'No disponible'
                ];
            });

            return response()->json($solicitudes);
        } catch (\Exception $e) {
            // Capturar cualquier excepción y devolver un error 500 con el mensaje de la excepción
            return response()->json(['error' => 'Error en el servidor: ' . $e->getMessage()], 500);
        }
    }





    public function create(Request $request)
    {
        try {
            // Validar la entrada
            $validatedData = $request->validate([
                'curso_id' => 'required|exists:cursos,id',
                'usuario_id' => 'required|integer', // Cambiar esto para depurar
                'status' => 'required|string',
                'fecha_solicitud' => 'nullable|date',
                'detalles' => 'nullable|string',
                'prioridad' => 'nullable|string',
            ]);

            // Buscar el curso por ID
            $curso = Curso::findOrFail($validatedData['curso_id']);

            // Crear una nueva solicitud
            $solicitud = new Solicitud();
            $solicitud->curso_id = $validatedData['curso_id'];
            $solicitud->alumno_id = $validatedData['usuario_id'];
            $solicitud->status = $validatedData['status'];
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
