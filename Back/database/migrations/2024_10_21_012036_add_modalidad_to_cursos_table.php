<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddModalidadToCursosTable extends Migration
{
    public function up()
    {
        Schema::table('cursos', function (Blueprint $table) {
            $table->string('modalidad')->after('descripción'); // Añade la columna 'modalidad' después de 'descripción'
        });
    }

    public function down()
    {
        Schema::table('cursos', function (Blueprint $table) {
            $table->dropColumn('modalidad'); // Elimina la columna 'modalidad' si la migración es revertida
        });
    }
}
