<?php
namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class notificacions extends Controller
{
    public function show($user_id)
    {
        try {
            // Buscar las notificaciones del usuario
            $notificaciones = Notificacion::where('usuario_id', $user_id)->get();
    
            // Verificar si se encontraron notificaciones
            if ($notificaciones->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'mensaje' => 'No se encontraron notificaciones para este usuario.',
                    'notificaciones' => []
                ], 200);
            }
    
            // Retornar las notificaciones en formato JSON
            return response()->json([
                'success' => true,
                'notificaciones' => $notificaciones
            ], 200);
    
        } catch (\Exception $e) {
            // Manejar cualquier error inesperado
            return response()->json([
                'success' => false,
                'mensaje' => 'Ocurrió un error al intentar obtener las notificaciones.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    public function destroy($id)
{
    try {
        // Buscar la notificación por ID
        $notificacion = Notificacion::find($id);

        // Verificar si la notificación existe
        if (!$notificacion) {
            return response()->json([
                'mensaje' => 'No se encontró la notificación con el ID proporcionado.'
            ], 404);
        }

        // Eliminar la notificación
        $notificacion->delete();

        // Retornar respuesta de éxito
        return response()->json([
            'mensaje' => 'Notificación eliminada exitosamente.'
        ], 200);

    } catch (\Exception $e) {
        // Manejar cualquier error inesperado
        return response()->json([
            'mensaje' => 'Ocurrió un error al intentar eliminar la notificación.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
