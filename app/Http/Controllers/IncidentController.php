<?php

namespace App\Http\Controllers;

use App\Enums\IncidentType;
use App\Enums\ReportStatus;
use App\Enums\SeverityLevel;
use App\Models\Barangay;
use App\Models\CommunityReport;
use App\Models\IncidentRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class IncidentController extends Controller
{
    // Lian, Batangas town center. The report form doesn't have a map
    // picker yet, so newly-created incidents are pinned here until
    // that's built.
    private const FALLBACK_LAT = 13.9457;

    private const FALLBACK_LNG = 120.6412;

    public function index(Request $request): Response
    {
        $incidents = IncidentRecord::query()
            ->with(['report', 'barangay'])
            ->orderByDesc('data_time')
            ->get()
            ->map(fn (IncidentRecord $incident) => $this->presentIncident($incident));

        $barangays = Barangay::query()
            ->orderBy('barangay_name')
            ->get(['barangay_id', 'barangay_name'])
            ->map(fn (Barangay $b) => ['id' => $b->barangay_id, 'name' => $b->barangay_name]);

        return Inertia::render('incidents', [
            'incidents' => $incidents,
            'barangays' => $barangays,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'incident_type' => ['required', Rule::enum(IncidentType::class)],
            'severity_level' => ['required', Rule::enum(SeverityLevel::class)],
            'location' => ['required', 'string', 'max:255'],
            'barangay_id' => ['required', 'integer', 'exists:barangay,barangay_id'],
            'data_time' => ['required', 'date'],
            'casualties' => ['required', 'integer', 'min:0'],
            'cause_of_fire' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'assigned_team' => ['nullable', 'string', 'max:150'],
            'units_deployed' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $report = CommunityReport::create([
            'user_id' => $user->id,
            'reporter_name' => $user->name,
            'contact_number' => $user->phone ?? 'N/A',
            'description' => $validated['location'],
            'latitude' => self::FALLBACK_LAT,
            'longitude' => self::FALLBACK_LNG,
            'status' => ReportStatus::Dispatched->value,
        ]);

        IncidentRecord::create([
            'report_id' => $report->report_id,
            'barangay_id' => $validated['barangay_id'],
            'data_time' => $validated['data_time'],
            'incident_type' => $validated['incident_type'],
            'severity_level' => $validated['severity_level'],
            'cause_of_fire' => $validated['cause_of_fire'] ?? null,
            'casualties' => $validated['casualties'],
            'notes' => $this->buildNotes($validated),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Incident report created.']);

        return to_route('incidents');
    }

    public function update(Request $request, IncidentRecord $incident): RedirectResponse
    {
        $validated = $request->validate([
            'incident_type' => ['required', Rule::enum(IncidentType::class)],
            'severity_level' => ['required', Rule::enum(SeverityLevel::class)],
            'barangay_id' => ['required', 'integer', 'exists:barangay,barangay_id'],
            'status' => ['required', Rule::enum(ReportStatus::class)],
            'casualties' => ['required', 'integer', 'min:0'],
            'cause_of_fire' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $incident->update([
            'incident_type' => $validated['incident_type'],
            'severity_level' => $validated['severity_level'],
            'barangay_id' => $validated['barangay_id'],
            'cause_of_fire' => $validated['cause_of_fire'] ?? null,
            'casualties' => $validated['casualties'],
            'notes' => $validated['notes'] ?? null,
        ]);

        $incident->report()->update(['status' => $validated['status']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Incident updated.']);

        return to_route('incidents');
    }

    public function destroy(IncidentRecord $incident): RedirectResponse
    {
        $report = $incident->report;
        $incident->delete();
        $report?->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Incident deleted.']);

        return to_route('incidents');
    }

    private function buildNotes(array $validated): ?string
    {
        $lines = [];

        if (! empty($validated['assigned_team'])) {
            $lines[] = 'Assigned Team: '.$validated['assigned_team'];
        }

        if (! empty($validated['units_deployed'])) {
            $lines[] = 'Units Deployed: '.$validated['units_deployed'];
        }

        if (! empty($validated['description'])) {
            $lines[] = $validated['description'];
        }

        return $lines === [] ? null : implode("\n", $lines);
    }

    private function presentIncident(IncidentRecord $incident): array
    {
        $typeLabels = [
            'structural' => ['en' => 'Structural Fire', 'fil' => 'Sunog sa Gusali'],
            'electrical' => ['en' => 'Electrical Fire', 'fil' => 'Sunog sa Kuryente'],
            'grass' => ['en' => 'Grass Fire', 'fil' => 'Sunog sa Damuhan'],
            'vehicular' => ['en' => 'Vehicle Fire', 'fil' => 'Sunog sa Sasakyan'],
            'other' => ['en' => 'Other Fire', 'fil' => 'Iba Pang Sunog'],
        ];

        $type = $incident->incident_type->value;

        return [
            'id' => $incident->incident_id,
            'type' => $typeLabels[$type]['en'] ?? ucfirst($type),
            'typeFilipino' => $typeLabels[$type]['fil'] ?? '',
            'typeValue' => $type,
            'location' => $incident->report?->description ?? '—',
            'barangay' => $incident->barangay?->barangay_name ?? '—',
            'barangayId' => $incident->barangay_id,
            'date' => $incident->data_time?->format('F j, Y - g:i A'),
            'dateRaw' => $incident->data_time?->toDateTimeString(),
            'severity' => ucfirst($incident->severity_level->value),
            'severityValue' => $incident->severity_level->value,
            'status' => $this->mapStatusToUi($incident->report?->status?->value),
            'statusValue' => $incident->report?->status?->value,
            'reportedBy' => $incident->report?->reporter_name ?? '—',
            'causeOfFire' => $incident->cause_of_fire,
            'casualties' => $incident->casualties,
            'notes' => $incident->notes,
        ];
    }

    private function mapStatusToUi(?string $status): string
    {
        return match ($status) {
            'verified' => 'Verified',
            'dispatched' => 'Responding',
            'resolved' => 'Resolved',
            'rejected' => 'Rejected',
            default => 'Pending',
        };
    }
}
