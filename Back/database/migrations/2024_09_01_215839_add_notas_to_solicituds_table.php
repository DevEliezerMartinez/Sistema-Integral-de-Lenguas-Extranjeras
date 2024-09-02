<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('solicituds', function (Blueprint $table) {
            $table->text('notas')->nullable(); // Agrega la columna 'notas'
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('solicituds', function (Blueprint $table) {
            $table->dropColumn('notas'); // Elimina la columna 'notas'
        });
    }
};
