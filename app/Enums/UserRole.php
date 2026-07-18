<?php

namespace App\Enums;

enum UserRole: string
{
    case Resident = 'resident';
    case BfpPersonnel = 'bfp_personnel';
    case Admin = 'admin';

    /**
     * Where a user with this role should land after logging in.
     */
    public function homeRouteName(): string
    {
        return match ($this) {
            self::Admin => 'admin.dashboard',
            self::BfpPersonnel, self::Resident => 'dashboard',
        };
    }
}