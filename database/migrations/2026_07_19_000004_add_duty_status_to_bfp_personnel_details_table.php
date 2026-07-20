<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bfp_personnel_details', function (Blueprint $table) {
            $table->string('duty_status', 20)->default('on_duty')->after('employee_number'); // on_duty, on_leave, deployed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bfp_personnel_details', function (Blueprint $table) {
            $table->dropColumn('duty_status');
        });
    }
};
