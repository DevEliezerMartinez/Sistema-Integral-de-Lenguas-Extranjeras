<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// Importación de modelos
use App\Models\Usuario;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\Coordinador;
use App\Models\Curso;
use App\Models\Calificacion;
use App\Models\Constancia;
use App\Models\Solicitud;
use App\Models\Notificacion;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---------------------------------------------------
        // 1. Usuarios base
        // ---------------------------------------------------
        $admin = Usuario::create([
            'nombre' => 'Administrador',
            'apellidos' => 'General',
            'correo_electronico' => 'admin@example.com',
            'contrasena' => bcrypt('admin123'),
            'genero' => 'M',
            'telefono' => '1111111111',
            'curp' => 'CURPADMIN123',
            'domicilio' => 'Oficinas centrales',
            'tipo_usuario' => 'admin',
        ]);

        // ---------------------------------------------------
        // 2. Crear usuarios de prueba
        // ---------------------------------------------------
        $docentes = Usuario::factory(5)->create(['tipo_usuario' => 'docente']);
        $coordinadores = Usuario::factory(3)->create(['tipo_usuario' => 'coordinador']);
        $estudiantesUsuarios = Usuario::factory(20)->create(['tipo_usuario' => 'estudiante']);

        // ---------------------------------------------------
        // 3. Crear docentes y coordinadores
        // ---------------------------------------------------
        foreach ($docentes as $usuario) {
            Docente::create([
                'usuario_id' => $usuario->id,
            ]);
        }

        foreach ($coordinadores as $usuario) {
            Coordinador::create([
                'usuario_id' => $usuario->id,
            ]);
        }

        // ---------------------------------------------------
        // 4. Crear estudiantes
        // ---------------------------------------------------
        foreach ($estudiantesUsuarios as $usuario) {
            Estudiante::create([
                'usuario_id' => $usuario->id,
                'carrera' => 'Idiomas',
                'numero_control' => 'NC-' . rand(10000, 99999),
                'historial_cursos' => json_encode([]),
                'perfil' => 'Estudiante registrado en el SILEx',
            ]);
        }

        // ---------------------------------------------------
        // 5. Crear cursos
        // ---------------------------------------------------
        $docente = Docente::first();
        $coordinador = Coordinador::first();

        $cursos = Curso::factory(10)->create([
            'maestro_id' => $docente?->id,
            'coordinador_id' => $coordinador?->id,
        ]);

        // ---------------------------------------------------
        // 6. Calificaciones
        // ---------------------------------------------------
        $estudiantes = Estudiante::all();

        foreach ($cursos as $curso) {
            foreach ($estudiantes->random(5) as $est) {
                Calificacion::create([
                    'curso_id' => $curso->id,
                    'alumno_id' => $est->id,
                    'calificacion' => rand(60, 100),
                ]);
            }
        }

        // ---------------------------------------------------
        // 7. Constancias (solo aprobados)
        // ---------------------------------------------------
        $calificacionesAprobados = Calificacion::where('calificacion', '>=', 70)->get();

        foreach ($calificacionesAprobados as $calif) {
            Constancia::create([
                'curso_id' => $calif->curso_id,
                'alumno_id' => $calif->alumno_id,
                'fecha_emision' => now(),
                'constancia' => 'pdf/' . uniqid() . '.pdf',
            ]);
        }

        // ---------------------------------------------------
        // 8. Solicitudes
        // ---------------------------------------------------
        foreach ($estudiantes as $est) {
            $curso = $cursos->random();

            Solicitud::create([
                'curso_id' => $curso->id,
                'alumno_id' => $est->id,
                'fecha_inscripcion' => now(),
                'status' => 'pendiente',
                'pdf' => null,
                'notas' => 'Solicitud generada automáticamente.',
            ]);
        }

        // ---------------------------------------------------
        // 9. Notificaciones
        // ---------------------------------------------------
        foreach (Usuario::all() as $usuario) {
            Notificacion::create([
                'usuario_id' => $usuario->id,
                'mensaje' => 'Bienvenido al Sistema Integral de Lenguas Extranjeras.',
                'fecha_notificacion' => now(),
                'estado' => 'no_leido',
            ]);
        }
    }
}
