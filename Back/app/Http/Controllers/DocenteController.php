<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    // Método para retornar la lista de docentes con su ID y nombre del usuario
    public function show()
    {
        // Obtener todos los docentes con la información completa del usuario asociado
        $docentes = Docente::join('usuarios', 'docentes.usuario_id', '=', 'usuarios.id')
            ->select(
                'docentes.id AS docente_id',
                'usuarios.id AS usuario_id',
                'usuarios.nombre',
                'usuarios.apellidos',
                'usuarios.correo_electronico',
                'usuarios.genero',
                'usuarios.telefono',
                'usuarios.curp',
                'usuarios.domicilio',
                'usuarios.tipo_usuario',
                'usuarios.created_at AS usuario_creado',
                'usuarios.updated_at AS usuario_actualizado',
                'docentes.created_at AS docente_creado',
                'docentes.updated_at AS docente_actualizado'
            )
            ->get();

        // Retornar los docentes como respuesta JSON
        return response()->json(['docentes' => $docentes]);
    }

    public function showCursos($docenteId)
    {
        // Encuentra el docente por ID
        $docente = Docente::with('cursos')->find($docenteId);
    
        // Verifica si el docente existe
        if (!$docente) {
            return response()->json([
                'message' => 'Docente no encontrado.'
            ], 404);
        }
    
        // Obtiene los cursos del docente y filtra solo los que están disponibles
        $cursosDisponibles = $docente->cursos->filter(function ($curso) {
            return $curso->estado === 'Disponible';
        });
    
        // Retornar los cursos disponibles como respuesta JSON
        return response()->json([
            'docente_id' => $docenteId,
            'cursos' => $cursosDisponibles
        ]);
    }

    public function showCursosArchivadosDocente($docenteId)
    {
        // Encuentra el docente por ID
        $docente = Docente::with('cursos')->find($docenteId);
    
        // Verifica si el docente existe
        if (!$docente) {
            return response()->json([
                'message' => 'Docente no encontrado.'
            ], 404);
        }
    
        // Obtiene los cursos del docente y filtra solo los que están archivados
        $cursosArchivados = $docente->cursos->filter(function ($curso) {
            return $curso->estado === 'Archivado';
        });
    
        // Retornar los cursos archivados como respuesta JSON
        return response()->json([
            'docente_id' => $docenteId,
            'cursos' => $cursosArchivados
        ]);
    }
    
    



    public function delete($docenteId)
    {
        // Encuentra el docente por ID con la relación de usuario
        $docente = Docente::with('usuario')->find($docenteId);

        // Verifica si el docente existe
        if (!$docente) {
            return response()->json([
                'message' => 'Docente no encontrado.'
            ], 404);
        }

        try {
            // Almacena el nombre completo del docente antes de eliminarlo
            $nombreDocente = $docente->nombre . ' ' . $docente->apellidos;

            // Elimina el usuario asociado si existe
            if ($docente->usuario) {
                $docente->usuario->delete();
            }

            // Elimina el docente
            $docente->delete();

            return response()->json([
                'message' => 'Docente y usuario eliminados con éxito.',
                'docente' => $nombreDocente
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el docente.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
