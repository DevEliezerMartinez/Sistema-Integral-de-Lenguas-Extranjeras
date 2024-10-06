<?php

namespace App\Http\Controllers;

use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SolicitudesController extends Controller
{
    /**
     * Crear una nueva solicitud.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        // Validar los datos de entrada
        $request->validate([
            'curso_id' => 'required|exists:cursos,id',
            'alumno_id' => 'required|exists:estudiantes,id',
            'fecha_inscripcion' => 'required|date',
            'status' => 'required|string',
            'pdf' => 'required|file|mimes:pdf|max:2048', // Valida que sea un PDF
        ]);
    
        // Almacenar el PDF en el almacenamiento
        $pdfPath = $request->file('pdf')->store('pdfs', 'public');
    
        // Crear la nueva solicitud
        $solicitud = Solicitud::create([
            'curso_id' => $request->curso_id,
            'alumno_id' => $request->alumno_id,
            'fecha_inscripcion' => $request->fecha_inscripcion,
            'status' => $request->status,
            'pdf' => $pdfPath, // Guardar la ruta del PDF
        ]);
    
        // Retornar la respuesta con el campo success
        return response()->json(['success' => true, 'solicitud' => $solicitud], 201);
    }
    

    /**
     * Obtener todas las solicitudes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $solicitudes = Solicitud::all();
        return response()->json($solicitudes);
    }

    // Puedes agregar más métodos aquí para manejar otras acciones relacionadas con solicitudes
}
