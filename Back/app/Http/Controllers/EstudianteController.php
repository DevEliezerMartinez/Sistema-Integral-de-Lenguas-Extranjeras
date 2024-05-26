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
    
}
