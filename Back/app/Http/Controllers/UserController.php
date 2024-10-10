<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $users = Usuario::all();
        return response()->json(['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Buscar el usuario por ID
        $user = Usuario::find($id);

        // Verificar si el usuario existe
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Retornar la información del usuario en formato JSON
        return response()->json(['user' => $user]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validar los datos del request
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'genero' => 'required|string|max:50',
            'telefono' => 'required|string|max:15',
            'curp' => 'required|string|max:18',
            'domicilio' => 'required|string|max:255',
        ]);

        try {
            // Encontrar el usuario por ID
            $user = Usuario::findOrFail($id);

            // Actualizar los campos del usuario
            $user->nombre = $validatedData['nombre'];
            $user->apellidos = $validatedData['apellidos'];
            $user->genero = $validatedData['genero'];
            $user->telefono = $validatedData['telefono'];
            $user->curp = $validatedData['curp'];
            $user->domicilio = $validatedData['domicilio'];

            // Guardar los cambios en la base de datos
            $user->save();

            // Responder con éxito
            return response()->json([
                'message' => 'Perfil actualizado correctamente',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            // Manejar posibles errores
            return response()->json([
                'message' => 'Error al actualizar el perfil',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
