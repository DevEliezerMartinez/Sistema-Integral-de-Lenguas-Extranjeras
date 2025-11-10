<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UsuarioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->firstName(),
            'apellidos' => $this->faker->lastName(),
            'correo_electronico' => $this->faker->unique()->safeEmail(),
            'contrasena' => bcrypt('password'),
            'genero' => $this->faker->randomElement(['M', 'F']),
            'telefono' => $this->faker->numerify('##########'),
            'curp' => strtoupper($this->faker->bothify('????######??????')),
            'domicilio' => $this->faker->address(),
            'tipo_usuario' => 'estudiante',
        ];
    }
}
