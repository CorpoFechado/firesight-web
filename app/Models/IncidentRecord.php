<?php

namespace App\Models;

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
class IncidentRecord extends Model
{
    protected $table = 'incident_record';

    protected $primaryKey = 'incident_id';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'data_time' => 'datetime',
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
