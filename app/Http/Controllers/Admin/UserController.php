<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\BfpPersonnelDetail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private const RANK_LABELS = [
        'fo1' => 'Fire Officer 1',
        'fo2' => 'Fire Officer 2',
        'fo3' => 'Fire Officer 3',
        'senior-fo' => 'Senior Fire Officer',
        'inspector' => 'Fire Inspector',
    ];

    public function index(Request $request): Response
    {
        $users = User::query()
            ->with('bfpPersonnelDetail')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'phone' => $user->phone,
                'status' => $user->status->value,
                'createdAt' => $user->created_at?->format('F j, Y'),
                'rank' => $user->bfpPersonnelDetail?->rank,
                'stationAssigned' => $user->bfpPersonnelDetail?->station_assigned,
                'employeeNumber' => $user->bfpPersonnelDetail?->employee_number,
                'dutyStatus' => $user->bfpPersonnelDetail?->duty_status?->value,
            ]);

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
            'rank' => ['required', 'string', 'in:fo1,fo2,fo3,senior-fo,inspector'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => UserRole::BfpPersonnel,
            'status' => UserStatus::Active,
        ]);

        BfpPersonnelDetail::create([
            'user_id' => $user->id,
            'rank' => self::RANK_LABELS[$validated['rank']],
            'station_assigned' => 'BFP Lian Fire Station',
            'employee_number' => 'BFP-LIAN-'.now()->format('Y').'-'.str_pad((string) $user->id, 3, '0', STR_PAD_LEFT),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'BFP personnel account created.']);

        return to_route('admin.users');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'rank' => ['nullable', 'string', 'in:fo1,fo2,fo3,senior-fo,inspector'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        if ($user->role === UserRole::BfpPersonnel && ! empty($validated['rank'])) {
            $user->bfpPersonnelDetail()->update([
                'rank' => self::RANK_LABELS[$validated['rank']],
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => "{$user->name}'s details have been updated."]);

        return to_route('admin.users');
    }

    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        $user->status = $user->status === UserStatus::Active ? UserStatus::Suspended : UserStatus::Active;
        $user->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $user->status === UserStatus::Suspended
                ? "{$user->name}'s account has been suspended."
                : "{$user->name}'s account has been reactivated.",
        ]);

        return to_route('admin.users');
    }
}
