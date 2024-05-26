<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicituds', function (Blueprint $table) {
           
            $table->id();
            $table->foreignId('curso_id')-> constrained('cursos')->onDelete('cascade');
            $table->foreignId('alumno_id')-> constrained('estudiantes')->onDelete('cascade');
            $table->dateTime('fecha_inscripcion');
            $table->string('status');
            $table->binary('pdf');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicituds');
    }
};
