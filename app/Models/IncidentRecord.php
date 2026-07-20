<?php

namespace App\Models;

use App\Enums\IncidentType;
use App\Enums\SeverityLevel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $incident_id
 * @property int $report_id
 * @property int $barangay_id
 * @property Carbon $data_time
 * @property string $incident_type
 * @property string $severity_level
 * @property string|null $cause_of_fire
 * @property int $casualties
 * @property string|null $notes
 */
#[Fillable(['report_id', 'barangay_id', 'data_time', 'incident_type', 'severity_level', 'cause_of_fire', 'casualties', 'notes'])]
class IncidentRecord extends Model
{
    protected $table = 'incident_record';

    protected $primaryKey = 'incident_id';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'data_time' => 'datetime',
            'incident_type' => IncidentType::class,
            'severity_level' => SeverityLevel::class,
        ];
    }

    /**
     * @return BelongsTo<CommunityReport, $this>
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(CommunityReport::class, 'report_id', 'report_id');
    }

    /**
     * @return BelongsTo<Barangay, $this>
     */
    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }
}
