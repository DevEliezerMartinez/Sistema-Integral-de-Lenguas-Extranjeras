<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// Importación de modelos
use App\Models\Usuario;
use App\Models\Estudiante;
use App\Models\Docente;
use App\Models\Coordinador;
use App\Models\Curso;
use App\Models\Calificaciones;
use App\Models\Constancias;
use App\Models\Solicitud;
use App\Models\Notificacion;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---------------------------------------------------
        // 1. Usuario Administrador
        // ---------------------------------------------------
        $admin = Usuario::create([
            'nombre' => 'Administrador',
            'apellidos' => 'General',
            'correo_electronico' => 'admin@tecnm.mx',
            'contrasena' => bcrypt('12345678'),
            'genero' => 'M',
            'telefono' => '1111111111',
            'curp' => 'CURPADMIN123',
            'domicilio' => 'Oficinas centrales',
            'tipo_usuario' => 'admin',
        ]);

        // ---------------------------------------------------
        // 2. Coordinadores
        // ---------------------------------------------------
        $coordinador1 = Usuario::create([
            'nombre' => 'Maricela',
            'apellidos' => 'Gallegos Cuevas',
            'correo_electronico' => 'maricela.gallegos@tecnm.mx',
            'contrasena' => bcrypt('password'),
            'genero' => 'F',
            'telefono' => '3331234567',
            'curp' => 'GACM850615MJCLRR01',
            'domicilio' => 'San Marcos, Guerrero',
            'tipo_usuario' => 'coordinador',
        ]);

        $coordinador2 = Usuario::create([
            'nombre' => 'Hermenegildo',
            'apellidos' => 'Cisneros Carrillo',
            'correo_electronico' => 'hermenegildo.cisneros@tecnm.mx',
            'contrasena' => bcrypt('password'),
            'genero' => 'M',
            'telefono' => '3339876543',
            'curp' => 'CICH780420HJCSRR08',
            'domicilio' => 'Acapulco, Guerrero',
            'tipo_usuario' => 'coordinador',
        ]);

        $coord1 = Coordinador::create(['usuario_id' => $coordinador1->id]);
        $coord2 = Coordinador::create(['usuario_id' => $coordinador2->id]);

        // ---------------------------------------------------
        // 3. Docente
        // ---------------------------------------------------
        $docente1Usuario = Usuario::create([
            'nombre' => 'Oscar Venancio',
            'apellidos' => 'Chora',
            'correo_electronico' => 'rm_smarcos@tecnm.mx',
            'contrasena' => bcrypt('password'),
            'genero' => 'M',
            'telefono' => '3335551234',
            'curp' => 'CHOV820315HJCHRR05',
            'domicilio' => 'San Marcos, Guerrero',
            'tipo_usuario' => 'docente',
        ]);

        $docente1 = Docente::create(['usuario_id' => $docente1Usuario->id]);

        // ---------------------------------------------------
        // 4. Estudiantes
        // ---------------------------------------------------
        $estudiante1Usuario = Usuario::create([
            'nombre' => 'Juan',
            'apellidos' => 'Pérez García',
            'correo_electronico' => '191230060@tecnm.mx',
            'contrasena' => bcrypt('password'),
            'genero' => 'M',
            'telefono' => '3334567890',
            'curp' => 'PEGJ010101HJCRNN09',
            'domicilio' => 'San Marcos, Guerrero',
            'tipo_usuario' => 'estudiante',
        ]);

        $estudiante2Usuario = Usuario::create([
            'nombre' => 'María',
            'apellidos' => 'López Martínez',
            'correo_electronico' => '191230061@tecnm.mx',
            'contrasena' => bcrypt('password'),
            'genero' => 'F',
            'telefono' => '3335678901',
            'curp' => 'LOMM020202MJCPRR08',
            'domicilio' => 'Acapulco, Guerrero',
            'tipo_usuario' => 'estudiante',
        ]);

        $estudiante3Usuario = Usuario::create([
            'nombre' => 'Carlos',
            'apellidos' => 'González Hernández',
            'correo_electronico' => '191230062@tecnm.mx',
            'contrasena' => bcrypt('password'),
            'genero' => 'M',
            'telefono' => '3336789012',
            'curp' => 'GOHC030303HJCNRR07',
            'domicilio' => 'Tlaquepaque, Guerrero',
            'tipo_usuario' => 'estudiante',
        ]);

        $estudiante1 = Estudiante::create([
            'usuario_id' => $estudiante1Usuario->id,
            'carrera' => 'Ingeniería en Sistemas Computacionales',
            'numero_control' => '191230060',
            'historial_cursos' => json_encode([]),
            'perfil' => 'Estudiante registrado en el SILEx',
        ]);

        $estudiante2 = Estudiante::create([
            'usuario_id' => $estudiante2Usuario->id,
            'carrera' => 'Ingeniería Industrial',
            'numero_control' => '191230061',
            'historial_cursos' => json_encode([]),
            'perfil' => 'Estudiante registrado en el SILEx',
        ]);

        $estudiante3 = Estudiante::create([
            'usuario_id' => $estudiante3Usuario->id,
            'carrera' => 'Ingeniería Electrónica',
            'numero_control' => '191230062',
            'historial_cursos' => json_encode([]),
            'perfil' => 'Estudiante registrado en el SILEx',
        ]);

        // ---------------------------------------------------
        // 5. Crear cursos manualmente (sin Factory)
        // ---------------------------------------------------
        $cursosData = [
            ['nombre' => 'Inglés Básico 1', 'nivel' => 'Básico', 'modalidad' => 'Presencial', 'descripcion' => 'Curso introductorio de inglés'],
            ['nombre' => 'Inglés Básico 2', 'nivel' => 'Básico', 'modalidad' => 'Presencial', 'descripcion' => 'Continuación del nivel básico'],
        ];

        $cursos = collect();

        foreach ($cursosData as $data) {
            $curso = Curso::create([
                'nombre' => $data['nombre'],
                'descripción' => $data['descripcion'],
                'nivel' => $data['nivel'],
                'estado' => 'Disponible',
                'maestro_id' => $docente1->id,
                'coordinador_id' => $coord1->id,
                'fecha_inicio' => now()->addDays(rand(1, 30)),
                'fecha_fin' => now()->addMonths(rand(3, 6)),
                'horario' => 'Lunes y Miércoles 8:00-10:00',
                'modalidad' => $data['modalidad'],
            ]);

            $cursos->push($curso);
        }

        // ---------------------------------------------------
        // 6. Calificaciones
        // ---------------------------------------------------
        $estudiantes = Estudiante::all();

        foreach ($cursos as $curso) {
            foreach ($estudiantes->random(min(2, $estudiantes->count())) as $est) {
                Calificaciones::create([
                    'curso_id' => $curso->id,
                    'alumno_id' => $est->id,
                    'calificacion' => rand(60, 100),
                ]);
            }
        }

        // ---------------------------------------------------
        // 7. Constancias (solo aprobados)
        // ---------------------------------------------------
        $calificacionesAprobados = Calificaciones::where('calificacion', '>=', 70)->get();

        foreach ($calificacionesAprobados as $calif) {
            Constancias::create([
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
                'status' => 'Pendiente',
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