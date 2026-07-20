<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        // Approximate response time as the gap between a report coming in
        // and BFP logging it as a formal incident record.
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

        $monthlyIncidents = IncidentRecord::query()
            ->selectRaw('DATE_FORMAT(data_time, "%b") as label, DATE_FORMAT(data_time, "%Y-%m") as sort_key, COUNT(*) as value')
            ->where('data_time', '>=', Carbon::now()->subMonths(5)->startOfMonth())
            ->groupBy('label', 'sort_key')
            ->orderBy('sort_key')
            ->get(['label', 'value'])
            ->map(fn ($row) => ['label' => $row->label, 'value' => (int) $row->value])
            ->values();

        $incidentTypeColors = [
            'structural' => '#dc2626',
            'electrical' => '#f97316',
            'grass' => '#16a34a',
            'vehicular' => '#0ea5e9',
            'other' => '#0f172a',
        ];

        $incidentTypes = IncidentRecord::query()
            ->selectRaw('incident_type, COUNT(*) as count')
            ->groupBy('incident_type')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'label' => ucfirst($row->incident_type),
                'count' => (int) $row->count,
                'color' => $incidentTypeColors[$row->incident_type] ?? '#94a3b8',
            ])
            ->values();

        $mapMarkers = CommunityReport::query()
            ->whereIn('status', ['pending', 'verified', 'dispatched'])
            ->latest('created_at')
            ->limit(10)
            ->get()
            ->map(fn (CommunityReport $report) => [
                'id' => 'report-'.$report->report_id,
                'position' => [$report->latitude, $report->longitude],
                'label' => $report->reporter_name,
                'status' => $report->status,
            ])
            ->values();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'monthlyIncidents' => $monthlyIncidents,
            'incidentTypes' => $incidentTypes,
            'mapMarkers' => $mapMarkers,
        ]);
    }
}
