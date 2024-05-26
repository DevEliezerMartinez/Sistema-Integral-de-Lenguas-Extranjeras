<?php

namespace App\Http\Controllers;

use App\Models\Usuario; // Asegúrate de importar el modelo Usuario
use App\Models\Estudiante; // Asegúrate de importar el modelo Usuario
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash; // Importa el facade Hash
use Illuminate\Support\Facades\Auth;


class AuthController extends Controller
{
    public function registrar(Request $request)
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

        // Crear el usuario con la contraseña hasheada
        $usuario = Usuario::create([
            'nombre' => $request->input('nombre'),
            'apellidos' => $request->input('apellidos'),
            'correo_electronico' => $request->input('correo_electronico'),
            'contrasena' => Hash::make($request->input('contrasena')), // Hash the password
            'genero' => $request->input('genero'),
            'telefono' => $request->input('telefono'),
            'curp' => $request->input('curp'),
            'domicilio' => $request->input('domicilio'),
            'tipo_usuario' => $request->input('tipo_usuario'),
        ]);
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


    public function login(Request $request)
    {
        $request->validate([
            'correo_electronico' => 'required|email',
            'contrasena' => 'required'
        ]);
    
        $user = Usuario::where('correo_electronico', $request->correo_electronico)->first();
    
        if (!$user || !Hash::check($request->contrasena, $user->contrasena)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }
    
        $token = $user->createToken('auth_token');
    
        return response()->json([
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'usuario' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
    return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }
    
}
