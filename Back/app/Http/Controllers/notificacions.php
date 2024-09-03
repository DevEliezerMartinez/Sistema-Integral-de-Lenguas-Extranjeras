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
                    'mensaje' => 'No se encontraron notificaciones para este usuario.',
                    'notificaciones' => []
                ], 404);
            }

            // Retornar las notificaciones en formato JSON
            return response()->json([
                'notificaciones' => $notificaciones
            ], 200);

        } catch (\Exception $e) {
            // Manejar cualquier error inesperado
            return response()->json([
                'mensaje' => 'Ocurrió un error al intentar obtener las notificaciones.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
