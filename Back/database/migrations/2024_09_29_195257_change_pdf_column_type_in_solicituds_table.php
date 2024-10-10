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
        Schema::table('solicituds', function (Blueprint $table) {
            // Cambiar la columna pdf de binary a string
            $table->string('pdf')->nullable()->change(); // Cambiar tipo de columna a string y permitir NULL
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('solicituds', function (Blueprint $table) {
            // Cambiar el tipo de vuelta a binary si se revierte
            $table->binary('pdf')->nullable()->change(); // Permitir NULL en el campo binary
        });
    }
};
