<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DutyStatus;
use App\Enums\FireUnitStatus;
use App\Http\Controllers\Controller;
use App\Models\BfpPersonnelDetail;
use App\Models\CommunityReport;
use App\Models\FireUnit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlertController extends Controller
{
    public function index(Request $request): Response
    {
        $units = FireUnit::query()
            ->orderBy('unit_name')
            ->get()
            ->map(fn (FireUnit $unit) => [
                'id' => $unit->unit_id,
                'name' => $unit->unit_name,
                'status' => $unit->status->value,
            ]);

        $personnel = [
            [
                'label' => 'On Duty',
                'value' => BfpPersonnelDetail::query()->where('duty_status', DutyStatus::OnDuty->value)->count(),
            ],
            [
                'label' => 'On Leave',
                'value' => BfpPersonnelDetail::query()->where('duty_status', DutyStatus::OnLeave->value)->count(),
            ],
            [
                'label' => 'Deployed',
                'value' => BfpPersonnelDetail::query()->where('duty_status', DutyStatus::Deployed->value)->count(),
            ],
        ];

        // Most urgent open report, to anchor the incident map marker.
        $activeReport = CommunityReport::query()
            ->whereIn('status', ['dispatched', 'verified'])
            ->orderByRaw("FIELD(status, 'dispatched', 'verified')")
            ->latest('created_at')
            ->first();

        $activeIncident = $activeReport ? [
            'label' => $activeReport->reporter_name,
            'position' => [$activeReport->latitude, $activeReport->longitude],
        ] : null;

        return Inertia::render('admin/alerts', [
            'units' => $units,
            'personnel' => $personnel,
            'activeIncident' => $activeIncident,
        ]);
    }

    public function assignUnit(Request $request, FireUnit $unit): RedirectResponse
    {
        $unit->update(['status' => FireUnitStatus::Assigned->value]);

        Inertia::flash('toast', ['type' => 'success', 'message' => "{$unit->unit_name} assigned to the active incident."]);

        return to_route('admin.alerts');
    }
}
