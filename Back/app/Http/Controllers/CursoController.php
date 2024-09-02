<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CursoController extends Controller
{
    // Método para obtener todos los cursos disponibles
    public function index()
    {
        // Obtener todos los cursos cuyo estado sea "Disponible"
        $cursosDisponibles = Curso::where('estado', 'Disponible')->get();

        // Responder con una respuesta JSON
        return response()->json(['cursos' => $cursosDisponibles], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // Validar los datos de la solicitud
        $validator = Validator::make($request->all(), [
            'nombre_modulo' => 'required|string',
            'descripcion' => 'string',
            'modalidad' => 'required|string',
            'nivel' => 'required|boolean',
            'estado' => 'required|boolean',
            'horarios' => 'required|string',
            'periodo' => 'required|array',
            'docente' => 'required|integer|exists:docentes,id',
            'coordinador' => 'required|integer',
            'periodo.inicio' => 'required|date',
            'periodo.fin' => 'required|date',
        ]);

        // Si hay errores en la validación, responder con error 400
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'request' => $request->all()
            ], 400);
        }

        try {
            // Procesar las fechas
            $startDate = $request->input('periodo.inicio');
            $endDate = $request->input('periodo.fin');

            // Crear el nuevo curso
            $curso = new Curso();
            $curso->nombre = $request->input('nombre_modulo');
            $curso->descripción = $request->input('descripcion');
            $curso->modalidad = $request->input('modalidad');
            $curso->nivel = $request->input('nivel');
            $curso->estado = 'Disponible'; // Puedes establecer el estado predeterminado
            $curso->horario = $request->input('horarios');
            $curso->maestro_id = $request->input('docente');
            $curso->coordinador_id  = $request->input('coordinador');
            $curso->created_at = Carbon::now(); // Asigna la fecha y hora actuales a created_at
            $curso->updated_at = Carbon::now(); // Asigna la fecha y hora actuales a created_at
            $curso->fecha_inicio = $startDate;
            $curso->fecha_fin = $endDate;
            $curso->save();

            // Responder con el curso creado
            return response()->json(['curso' => $curso], 201);
        } catch (\Exception $e) {
            // Registrar el error con detalles
            Log::error('Error en creaaar: ' . $e->getMessage(), [
                'request' => $request->all(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Responder con los detalles del error
            return response()->json([
                'error' => 'Error al crear curso',
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Puedes implementar esta función si es necesario
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Buscar el curso por su ID y cargar la relación del docente
        $curso = Curso::with('docente.usuario')->find($id);

        // Verificar si el curso existe
        if ($curso) {
            // Incluir el nombre del docente en la respuesta
            return response()->json([
                'curso' => $curso,
                'docente' => $curso->docente ? [
                    'id' => $curso->docente->id,
                    'nombre' => $curso->docente->usuario->nombre,  // Asegúrate de que el campo sea correcto en Usuario
                ] : null,
            ], 200);
        } else {
            return response()->json(['error' => 'Curso no encontrado'], 404);
        }
    }

    public function ArchiveCourse($id)
    {
        // Buscar el curso por su ID y cargar la relación del docente
        $curso = Curso::with('docente.usuario')->find($id);
    
        // Verificar si el curso existe
        if ($curso) {
            // Cambiar el estado del curso a "Archivado"
            $curso->estado = 'Archivado';
    
            // Guardar los cambios en la base de datos
            $curso->save();
    
            // Incluir el nombre del docente en la respuesta
            return response()->json([
                'mensaje' => 'El curso ha sido archivado exitosamente.',
                'success' => "true"
               
            ], 200);
        } else {
            return response()->json(['error' => 'Curso no encontrado','success' => "false"], 404);
        }
    }
    



    public function showArchived()
    {
        // Buscar todos los cursos que tienen el estado 'Archivado' y cargar la relación del docente
        $cursos = Curso::with('docente.usuario')
            ->where('estado', 'Archivado')  // Filtrar por estado
            ->get();
    
        // Verificar si se encontraron cursos
        if ($cursos->isNotEmpty()) {
            // Incluir los detalles del docente y el período en la respuesta
            return response()->json([
                'cursos' => $cursos->map(function ($curso) {
                    return [
                        'id' => $curso->id,
                        'nombre' => $curso->nombre,
                        'estado' => $curso->estado,
                        'periodo' => [
                            'fecha_inicio' => $curso->fecha_inicio,
                            'fecha_fin' => $curso->fecha_fin,
                        ], // Incluir las fechas de inicio y fin
                        'docente' => $curso->docente ? [
                            'id' => $curso->docente->id,
                            'nombre' => $curso->docente->usuario->nombre,  // Asegúrate de que el campo sea correcto en Usuario
                        ] : null,
                    ];
                }),
            ], 200);
        } else {
            return response()->json(['error' => 'No se encontraron cursos archivados'], 404);
        }
    }
    
    




    // Método para obtener todos los cursos activos
    public function active()
    {
        // Obtener todos los cursos cuyo estado sea "Activo"
        $cursosActivos = Curso::where('estado', 'Disponible')->get();

        // Verificar si hay cursos activos
        if ($cursosActivos->isEmpty()) {
            return response()->json(['message' => 'No hay cursos activos en este momento'], 404);
        }

        // Responder con una respuesta JSON
        return response()->json(['cursos' => $cursosActivos], 200);
    }
}
