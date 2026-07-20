<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The original firesight_db.sql schema left `report_id` as a plain
     * unsigned int (no AUTO_INCREMENT), which means Eloquent's create()
     * has no way to generate an id. MySQL automatically continues
     * numbering from the current max value when a column is converted,
     * so existing rows are unaffected.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE `community_report` MODIFY `report_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE `community_report` MODIFY `report_id` INT(10) UNSIGNED NOT NULL');
    }
};
