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
    try {
        $user = Usuario::findOrFail($id);
        
        // Construir la URL completa de la foto
        if ($user->foto) {
            $user->foto = url('storage/' . $user->foto);
            // O también puedes usar: asset('storage/' . $user->foto)
        }
        
        return response()->json([
            'user' => $user,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al obtener la información del usuario',
            'error' => $e->getMessage(),
        ], 500);
    }
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
        'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validar imagen
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

        // Procesar la imagen si fue enviada
        if ($request->hasFile('foto')) {
            // Eliminar la foto anterior si existe
            if ($user->foto && \Storage::disk('public')->exists($user->foto)) {
                \Storage::disk('public')->delete($user->foto);
            }

            // Guardar la nueva foto
            $file = $request->file('foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('perfiles', $filename, 'public');
            
            // Guardar la ruta en la base de datos
            $user->foto = $path;
        }

        // Guardar los cambios en la base de datos
        $user->save();

        // Construir la URL completa de la foto
        $user->foto = $user->foto ? asset('storage/' . $user->foto) : null;

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
