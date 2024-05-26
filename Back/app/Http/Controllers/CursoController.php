<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Http\Request;

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
    public function show($id)
    {
        // Buscar el curso por su ID
        $curso = Curso::find($id);

        // Verificar si el curso existe
        if ($curso) {
            return response()->json(['curso' => $curso], 200);
        } else {
            return response()->json(['error' => 'Curso no encontrado'], 404);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
