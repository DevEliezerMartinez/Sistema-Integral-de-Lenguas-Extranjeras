<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\Solicitud;
use App\Models\Notificacion;

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
    public function showInfobyStudent($curso_id, $alumno_id)
    {
        // Buscar el curso por su ID y cargar la relación con las calificaciones del estudiante
        $curso = Curso::with(['docente.usuario', 'calificaciones' => function ($query) use ($alumno_id) {
            // Filtrar las calificaciones por el alumno específico
            $query->where('alumno_id', $alumno_id);
        }])->find($curso_id);

        // Verificar si el curso existe
        if (!$curso) {
            return response()->json(['error' => 'Curso no encontrado'], 404);
        }

        // Verificar si el alumno tiene una calificación en este curso
        $calificacion = $curso->calificaciones->first();
        $nota = $calificacion ? $calificacion->calificacion : 'No disponible';

        // Devolver los detalles del curso junto con la calificación del alumno
        return response()->json([
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'descripcion' => $curso->descripcion,
                'modalidad' => $curso->modalidad,
                'nivel' => $curso->nivel,
                'estado' => $curso->estado,
                'horario' => $curso->horario,
                'maestro_id' => $curso->maestro_id,
                'coordinador_id' => $curso->coordinador_id,
                'fecha_inicio' => $curso->fecha_inicio,
                'fecha_fin' => $curso->fecha_fin,
                'docente' => $curso->docente ? [
                    'id' => $curso->docente->id,
                    'nombre' => $curso->docente->usuario->nombre,
                ] : null,
                'calificacion_alumno' => $nota,
            ],
        ], 200);
    }



    public function show($id)
    {
        // Buscar el curso por su ID y cargar la relación del docente
        $curso = Curso::with('docente.usuario')->find($id);

        // Verificar si el curso existe
        if ($curso) {
            return response()->json([
                'curso' => [
                    'id' => $curso->id,
                    'nombre' => $curso->nombre,
                    'descripcion' => $curso->descripción,
                    'modalidad' => $curso->modalidad,
                    'nivel' => $curso->nivel,
                    'estado' => $curso->estado,
                    'horario' => $curso->horario,
                    'maestro_id' => $curso->maestro_id,
                    'coordinador_id' => $curso->coordinador_id,
                    'created_at' => $curso->created_at,
                    'updated_at' => $curso->updated_at,
                    'fecha_inicio' => $curso->fecha_inicio,
                    'fecha_fin' => $curso->fecha_fin,
                    'docente' => $curso->docente ? [
                        'id' => $curso->docente->id,
                        'nombre' => $curso->docente->usuario->nombre,
                    ] : null,
                ],
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

            // Crear la notificación para el usuario con ID 1
            $notificacion = new Notificacion();
            $notificacion->usuario_id = 1; // ID del usuario que recibirá la notificación
            $notificacion->mensaje = "El curso '{$curso->nombre}' ha sido archivado."; // Asumiendo que tienes un campo 'nombre' en el curso
            $notificacion->fecha_notificacion = now(); // Fecha y hora actuales
            $notificacion->estado = "visible"; // Estado de la notificación
            $notificacion->save();

            // Incluir el nombre del docente en la respuesta
            return response()->json([
                'mensaje' => 'El curso ha sido archivado exitosamente.',
                'success' => "true"
            ], 200);
        } else {
            return response()->json(['error' => 'Curso no encontrado', 'success' => "false"], 404);
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
            // Retornar respuesta con success true y los cursos
            return response()->json([
                'success' => true,  // Indicar que la operación fue exitosa
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
            // Retornar respuesta con success true, pero sin cursos
            return response()->json([
                'success' => true,  // La operación fue exitosa, pero no hay datos
                'cursos' => [],  // Enviar un array vacío
            ], 200);  // Mantener el código de respuesta 200 ya que la solicitud fue exitosa
        }
    }




    public function getCursosConEstudiantes()
    {
        try {
            // Obtener todos los cursos con la relación de docentes
            $cursos = Curso::with('docente.usuario')->get();

            // Verificar si se encontraron cursos
            if ($cursos->isEmpty()) {
                return response()->json([
                    'success' => true,  // No hubo error, pero no se encontraron cursos
                    'mensaje' => 'No se encontraron cursos.',
                    'cursos' => []  // Devuelve un array vacío en lugar de null
                ], 200);
            }

            // Mapear la respuesta con los datos correctos
            $cursosConEstudiantes = $cursos->map(function ($curso) {
                // Obtener las solicitudes aceptadas para cada curso
                $solicitudes = Solicitud::where('curso_id', $curso->id)
                    ->where('status', 'Aceptada')
                    ->with('alumno.usuario')
                    ->get();

                // Mapear las solicitudes para obtener los datos de los estudiantes
                $estudiantes = $solicitudes->map(function ($solicitud) {
                    return [
                        'ID_Inscripcion' => $solicitud->alumno->id ?? 'No disponible',  // ID del estudiante
                        'Nombre_Alumno' => $solicitud->alumno->usuario->nombre ?? 'No disponible',
                        'Apellidos_Alumno' => $solicitud->alumno->usuario->apellidos ?? 'No disponible',
                        'Fecha_Inscripcion' => $solicitud->fecha_inscripcion ?? 'No disponible',
                        'Estado_Solicitud' => $solicitud->status ?? 'No disponible',
                        'PDF_Solicitud' => $solicitud->pdf ?? 'No disponible'
                    ];
                });

                // Retornar los datos del curso con su docente y estudiantes
                return [
                    'Curso' => [
                        'ID' => $curso->id,
                        'Nombre' => $curso->nombre,
                        'Descripcion' => $curso->descripcion,
                        'Fecha_Inicio' => $curso->fecha_inicio,
                        'Fecha_Fin' => $curso->fecha_fin,
                        'Horario' => $curso->horario,
                        'Docente' => $curso->docente ? [
                            'ID' => $curso->docente->id,
                            'Nombre' => $curso->docente->usuario->nombre ?? 'No disponible',
                            'Apellidos' => $curso->docente->usuario->apellidos ?? 'No disponible',
                        ] : 'No disponible',
                    ],
                    'Estudiantes' => $estudiantes
                ];
            });

            return response()->json([
                'success' => true,  // Operación exitosa
                'cursos' => $cursosConEstudiantes
            ], 200);
        } catch (\Exception $e) {
            // Manejar cualquier error inesperado
            return response()->json([
                'success' => false,  // Operación fallida
                'mensaje' => 'Ocurrió un error al intentar obtener los cursos con estudiantes.',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function cursosDeAlumno($alumnoId)
    {
        try {
            // Obtener las solicitudes aceptadas para el alumno
            $solicitudes = Solicitud::where('alumno_id', $alumnoId)
                ->where('status', 'Aceptada')
                ->with('curso.docente.usuario') // Cargar la relación del curso y el docente
                ->get();

            // Verificar si no se encontraron cursos para el alumno
            if ($solicitudes->isEmpty()) {
                return response()->json([
                    'mensaje' => 'El alumno no tiene cursos asociados.',
                    'exito' => true, // Indicar que la operación fue exitosa pero no hay datos
                    'cursos' => []
                ], 200);
            }

            // Mapear los cursos del alumno
            $cursosAlumno = $solicitudes->map(function ($solicitud) {
                $curso = $solicitud->curso;
                return [
                    'Curso_ID' => $curso->id,
                    'Nombre_Curso' => $curso->nombre,
                    'Descripcion_Curso' => $curso->descripción,
                    'Fecha_Inicio' => $curso->fecha_inicio,
                    'Fecha_Fin' => $curso->fecha_fin,
                    'Horario' => $curso->horario,
                    'Docente' => $curso->docente ? [
                        'ID' => $curso->docente->id,
                        'Nombre' => $curso->docente->usuario->nombre,
                        'Apellidos' => $curso->docente->usuario->apellidos,
                    ] : 'No disponible',
                ];
            });

            // Retornar la lista de cursos asociados al alumno
            return response()->json([
                'mensaje' => 'Cursos asociados al alumno obtenidos exitosamente.',
                'exito' => true,
                'cursos' => $cursosAlumno
            ], 200);
        } catch (\Exception $e) {
            // Manejar cualquier error inesperado
            return response()->json([
                'mensaje' => 'Ocurrió un error al obtener los cursos del alumno.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function ProgresoEstudiante($alumnoId)
    {
        try {
            // Obtener las solicitudes aceptadas para el alumno
            $solicitudes = Solicitud::where('alumno_id', $alumnoId)
                ->where('status', 'Aceptada')
                ->with('curso') // Cargar la relación del curso
                ->get();

            // Verificar si no se encontraron solicitudes
            if ($solicitudes->isEmpty()) {
                return response()->json([
                    'mensaje' => 'El alumno no tiene cursos asociados.',
                    'exito' => true, // Indicar que la operación fue exitosa pero no hay datos
                    'progreso' => []
                ], 200);
            }

            // Mapear el progreso del estudiante en cada curso
            $progresoEstudiante = $solicitudes->map(function ($solicitud) {
                $curso = $solicitud->curso;

                // Aquí podrías calcular el progreso del estudiante (puedes personalizar esta lógica)
                // Por ejemplo, podrías tener un campo en la solicitud que indique el progreso
                $progreso = $solicitud->progreso ?? 0; // Suponiendo que hay un campo 'progreso' en la solicitud

                return [
                    'Curso_ID' => $curso->id,
                    'Nombre_Curso' => $curso->nombre,
                    'Descripcion_Curso' => $curso->descripcion,
                    'Fecha_Inicio' => $curso->fecha_inicio,
                    'Fecha_Fin' => $curso->fecha_fin,
                    'Horario' => $curso->horario,
                    'Progreso' => $progreso,
                ];
            });

            // Retornar el progreso del estudiante
            return response()->json([
                'mensaje' => 'Progreso del estudiante obtenido exitosamente.',
                'exito' => true,
                'progreso' => $progresoEstudiante
            ], 200);
        } catch (\Exception $e) {
            // Manejar cualquier error inesperado
            return response()->json([
                'mensaje' => 'Ocurrió un error al obtener el progreso del estudiante.',
                'error' => $e->getMessage()
            ], 500);
        }
    }






    // Método para obtener todos los cursos activos
    public function active()
    {
        // Obtener todos los cursos cuyo estado sea "Disponible" o "En curso"
        $cursosActivos = Curso::whereIn('estado', ['Disponible', 'En curso'])->get();

        // Verificar si hay cursos activos
        if ($cursosActivos->isEmpty()) {
            return response()->json(['message' => 'No hay cursos activos en este momento'], 404);
        }

        // Responder con una respuesta JSON
        return response()->json(['cursos' => $cursosActivos], 200);
    }
}
