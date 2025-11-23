<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Estudiante;
use App\Models\Coordinador;
use App\Models\Docente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
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
            'tipo_usuario' => 'required|string|in:estudiante,coordinador,docente',
            // Solo valida los campos del estudiante si el tipo_usuario es estudiante
            'carrera' => 'nullable|required_if:tipo_usuario,estudiante|string',
            'numero_control' => 'nullable|required_if:tipo_usuario,estudiante|string',
            'historial_cursos' => 'nullable',
            'perfil' => 'nullable',
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
            'contrasena' => Hash::make($request->input('contrasena')),
            'genero' => $request->input('genero'),
            'telefono' => $request->input('telefono'),
            'curp' => $request->input('curp'),
            'domicilio' => $request->input('domicilio'),
            'tipo_usuario' => $request->input('tipo_usuario'),
        ]);

        $response = [
            'message' => 'Usuario registrado correctamente',
            'usuario' => $usuario,
            'condicional' => null, // Indicará a qué condicional entró
            'tipo_usuario_creado' => $request->input('tipo_usuario')
        ];

        // Crear un estudiante, coordinador o docente según el tipo de usuario
        if ($request->input('tipo_usuario') === 'estudiante') {
            $estudiante = Estudiante::create([
                'usuario_id' => $usuario->id,
                'carrera' => $request->input('carrera'),
                'numero_control' => $request->input('numero_control'),
                'historial_cursos' => $request->input('historial_cursos'),
                'perfil' => $request->input('perfil'),
            ]);
            $response['estudiante'] = $estudiante;
            $response['message'] = 'Estudiante registrado correctamente';
            $response['condicional'] = 'estudiante';
        } elseif ($request->input('tipo_usuario') === 'coordinador') {
            $coordinador = Coordinador::create([
                'usuario_id' => $usuario->id,
                // Agrega aquí los campos específicos para el coordinador si los hay
            ]);
            $response['coordinador'] = $coordinador;
            $response['message'] = 'Coordinador registrado correctamente';
            $response['condicional'] = 'coordinador';
        } elseif ($request->input('tipo_usuario') === 'docente') {
            $docente = Docente::create([
                'usuario_id' => $usuario->id,
                // Agrega aquí los campos específicos para el docente si los hay
            ]);
            $response['docente'] = $docente;
            $response['message'] = 'Docente registrado correctamente';
            $response['condicional'] = 'docente';
        }

        // Responder con una respuesta JSON
        return response()->json($response, 201);
    }

    public function test(Request $request)
    {



        $response = [
            'message' => 'Funcionando correctamente',
            'condicional' => null, // Indicará a qué condicional entró

        ];


        // Responder con una respuesta JSON
        return response()->json($response, 201);
    }

    public function login(Request $request)
    {
        // Validación de campos
        $request->validate([
            'correo_electronico' => 'required|email',
            'contrasena' => 'required',
            'tipo_acceso' => 'nullable|string'
        ]);

        // Verificar si existe el usuario
        $user = Usuario::where('correo_electronico', $request->correo_electronico)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Correo electrónico no registrado.'
            ], 404);
        }

        // Verificar la contraseña
        if (!Hash::check($request->contrasena, $user->contrasena)) {
            return response()->json([
                'success' => false,
                'error' => 'Contraseña incorrecta.'
            ], 401);
        }

        // Inicializar variables para los roles
        $docente = null;
        $coordinador = null;
        $estudiante = null;

        // Manejo de acceso según el tipo
        switch ($request->tipo_acceso) {
            case 'accesoDocente':
                $docente = Docente::where('usuario_id', $user->id)->first();
                if (!$docente) {
                    return response()->json([
                        'success' => false,
                        'error' => 'No se encontró un docente asociado a este usuario.'
                    ], 404);
                }
                break;

            case 'accesoCoordinador':
                $coordinador = Coordinador::where('usuario_id', $user->id)->first();
                if (!$coordinador) {
                    return response()->json([
                        'success' => false,
                        'error' => 'No se encontró un coordinador asociado a este usuario.'
                    ], 404);
                }
                break;

            case 'accesoEstudiante':
                $estudiante = Estudiante::where('usuario_id', $user->id)->first();
                if (!$estudiante) {
                    return response()->json([
                        'success' => false,
                        'error' => 'No se encontró un estudiante asociado a este usuario.'
                    ], 404);
                }
                break;

            default:
                break;
        }

        // 🔥 IMPORTANTE: Autenticar y regenerar sesión
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        // Respuesta exitosa
        return response()->json([
            'success' => true,
            'usuario' => $user,
            'docente' => $docente,
            'coordinador' => $coordinador,
            'estudiante' => $estudiante
        ]);
    }






    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }
}
