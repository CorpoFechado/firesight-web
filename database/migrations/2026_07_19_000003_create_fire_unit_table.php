<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fire_unit', function (Blueprint $table) {
            $table->increments('unit_id');
            $table->string('unit_name', 100);
            $table->string('status', 20)->default('available'); // available, assigned, on_scene
            $table->timestamps();
        });

        // Seed a starting fleet so the page isn't empty on a fresh install.
        DB::table('fire_unit')->insert([
            ['unit_name' => 'Fire Truck 01', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['unit_name' => 'Fire Truck 02', 'status' => 'available', 'created_at' => now(), 'updated_at' => now()],
            ['unit_name' => 'Fire Truck 03', 'status' => 'on_scene', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fire_unit');
    }
};
