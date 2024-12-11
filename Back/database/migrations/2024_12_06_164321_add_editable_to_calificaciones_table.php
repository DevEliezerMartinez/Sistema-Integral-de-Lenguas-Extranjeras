<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('calificaciones', function (Blueprint $table) {
            $table->boolean('editable')->default(true); // Indica si la calificación es editable
        });
    }

    public function down()
    {
        Schema::table('calificaciones', function (Blueprint $table) {
            $table->dropColumn('editable');
        });
    }
};
