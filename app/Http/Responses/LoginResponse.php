<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $role = $user?->role instanceof UserRole ? $user->role : UserRole::Resident;

        return redirect()->intended(route($role->homeRouteName()));
    }
}