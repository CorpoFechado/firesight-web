<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IncidentRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DataManagementController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/data-management');
    }

    public function exportCsv(): StreamedResponse
    {
        $incidents = IncidentRecord::query()
            ->with(['report', 'barangay'])
            ->orderByDesc('data_time')
            ->get();

        $filename = 'firesight-incident-reports-'.now()->format('Y-m-d').'.csv';

        $callback = function () use ($incidents) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Incident ID', 'Date/Time', 'Barangay', 'Type', 'Severity',
                'Cause', 'Casualties', 'Reporter', 'Report Status', 'Notes',
            ]);

            foreach ($incidents as $incident) {
                fputcsv($handle, [
                    $incident->incident_id,
                    $incident->data_time?->format('Y-m-d H:i'),
                    $incident->barangay?->barangay_name,
                    ucfirst($incident->incident_type),
                    ucfirst($incident->severity_level),
                    $incident->cause_of_fire,
                    $incident->casualties,
                    $incident->report?->reporter_name,
                    $incident->report?->status,
                    $incident->notes,
                ]);
            }

            fclose($handle);
        };

        return ResponseFacade::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function exportPrintable(): \Illuminate\Contracts\View\View
    {
        $incidents = IncidentRecord::query()
            ->with(['report', 'barangay'])
            ->orderByDesc('data_time')
            ->get();

        return view('reports.incidents-printable', [
            'incidents' => $incidents,
            'generatedAt' => now(),
        ]);
    }
}
