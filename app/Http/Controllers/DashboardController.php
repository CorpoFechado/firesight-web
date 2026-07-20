<?php

namespace App\Http\Controllers;

use App\Models\CommunityReport;
use App\Models\IncidentRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalIncidents = IncidentRecord::query()->count();

        $activeIncidents = CommunityReport::query()
            ->whereIn('status', ['pending', 'verified', 'dispatched'])
            ->count();

        $resolvedToday = CommunityReport::query()
            ->where('status', 'resolved')
            ->whereDate('created_at', Carbon::today())
            ->count();

        $avgResponseMinutes = IncidentRecord::query()
            ->join('community_report', 'community_report.report_id', '=', 'incident_record.report_id')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, community_report.created_at, incident_record.data_time)) as avg_minutes')
            ->value('avg_minutes');

        $stats = [
            ['label' => 'Total Incidents', 'value' => (string) $totalIncidents],
            ['label' => 'Active Incidents', 'value' => (string) $activeIncidents],
            ['label' => 'Resolved Today', 'value' => (string) $resolvedToday],
            ['label' => 'Avg Response Time', 'value' => $avgResponseMinutes !== null ? round(max($avgResponseMinutes, 0), 1).' min' : 'N/A'],
        ];

        $mapMarkers = CommunityReport::query()
            ->whereIn('status', ['pending', 'verified', 'dispatched'])
            ->latest('created_at')
            ->limit(4)
            ->get()
            ->map(fn (CommunityReport $report) => [
                'id' => 'report-'.$report->report_id,
                'position' => [$report->latitude, $report->longitude],
                'label' => $report->reporter_name,
                'status' => $report->status->value,
            ])
            ->values();

        $recentIncidents = IncidentRecord::query()
            ->with('barangay')
            ->latest('data_time')
            ->limit(3)
            ->get()
            ->map(fn (IncidentRecord $incident) => [
                'id' => $incident->incident_id,
                'label' => ucfirst($incident->incident_type->value).' Fire · '.($incident->barangay?->barangay_name ?? '—'),
                'time' => $incident->data_time?->format('g:i A'),
            ])
            ->values();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'mapMarkers' => $mapMarkers,
            'recentIncidents' => $recentIncidents,
        ]);
    }
}
