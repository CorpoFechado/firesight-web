<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Juan dela Cruz',
            'email' => 'juan.delacruz@email.com',
            'role' => UserRole::Resident,
        ]);

        User::factory()->create([
            'name' => 'Lt. Miguel Rodriguez',
            'email' => 'm.rodriguez@bfp.gov.ph',
            'role' => UserRole::BfpPersonnel,
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@lian.gov.ph',
            'role' => UserRole::Admin,
        ]);
    }
}