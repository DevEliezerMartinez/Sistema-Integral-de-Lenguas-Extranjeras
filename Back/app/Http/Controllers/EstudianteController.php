<?php

namespace App\Http\Controllers;

use App\Models\Usuario; // Asegúrate de importar el modelo Usuario
use App\Models\Estudiante; // Asegúrate de importar el modelo Usuario
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EstudianteController extends Controller
{

    /**
     * Almacena un nuevo usuario en la base de datos.
     */
    public function store(Request $request)
    {
        // Validar los datos de la solicitud para el usuario
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'correo_electronico' => 'required|email|unique:usuarios',
            'contrasena' => 'required|min:6',
            'genero' => 'required',
            'telefono' => 'required',
            'curp' => 'required|string',
            'domicilio' => 'required|string',
            'tipo_usuario' => 'required|string',
        ]);

        // Verificar si la validación del usuario falla
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Crear el usuario
        $usuario = Usuario::create($request->only(['nombre', 'apellidos', 'correo_electronico', 'contrasena', 'genero', 'telefono', 'curp', 'domicilio', 'tipo_usuario']));

        // Crear el estudiante asociado al usuario
        $estudiante = Estudiante::create([
            'usuario_id' => $usuario->id,
            'carrera' => $request->input('carrera'),
            'numero_control' => $request->input('numero_control'),
            'historial_cursos' => $request->input('historial_cursos'),
            'perfil' => $request->input('perfil'),
        ]);

        // Responder con una respuesta JSON
        return response()->json(['message' => 'Estudiante registrado correctamente', 'estudiante' => $estudiante], 201);
    }

    public function show($id)
    {
        // Buscar al estudiante por ID
        $estudiante = Estudiante::with('usuario') // Relacionar el estudiante con su usuario
            ->where('id', $id)
            ->first();

        // Verificar si el estudiante existe
        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        // Responder con los detalles completos del estudiante
        return response()->json([
            'estudiante' => [
                'nombre' => $estudiante->usuario->nombre,
                'apellidos' => $estudiante->usuario->apellidos,
                'correo_electronico' => $estudiante->usuario->correo_electronico,
                'telefono' => $estudiante->usuario->telefono,
                'curp' => $estudiante->usuario->curp,
                'domicilio' => $estudiante->usuario->domicilio,
                'genero' => $estudiante->usuario->genero,
                'carrera' => $estudiante->carrera,
                'numero_control' => $estudiante->numero_control,
                'historial_cursos' => $estudiante->historial_cursos,
                'perfil' => $estudiante->perfil,
            ]
        ], 200);
    }

    public function cursosDeAlumno(){

    }
}
