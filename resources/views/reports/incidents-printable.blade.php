<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>FireSight Incident Report</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1a1a1a;
            margin: 32px;
        }
        h1 { font-size: 20px; margin-bottom: 2px; }
        p.subtitle { color: #555; margin-top: 0; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background: #f3f4f6; }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11px;
            background: #fee2e2;
            color: #b91c1c;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <button class="no-print" onclick="window.print()" style="float:right; padding:8px 16px;">Print / Save as PDF</button>
    <h1>FireSight &mdash; Incident Report</h1>
    <p class="subtitle">
        BFP Lian, Batangas &middot; Generated {{ $generatedAt->format('F j, Y g:i A') }}
    </p>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Date/Time</th>
                <th>Barangay</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Cause</th>
                <th>Casualties</th>
                <th>Reporter</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($incidents as $incident)
                <tr>
                    <td>{{ $incident->incident_id }}</td>
                    <td>{{ $incident->data_time?->format('M j, Y g:i A') }}</td>
                    <td>{{ $incident->barangay?->barangay_name }}</td>
                    <td>{{ ucfirst($incident->incident_type) }}</td>
                    <td><span class="badge">{{ ucfirst($incident->severity_level) }}</span></td>
                    <td>{{ $incident->cause_of_fire }}</td>
                    <td>{{ $incident->casualties }}</td>
                    <td>{{ $incident->report?->reporter_name }}</td>
                    <td>{{ $incident->notes }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" style="text-align:center; color:#888;">No incident records yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
