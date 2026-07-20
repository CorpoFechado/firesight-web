<?php

namespace App\Models;

use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $report_id
 * @property int $user_id
 * @property string $reporter_name
 * @property string $contact_number
 * @property string|null $description
 * @property string $status
 * @property float $latitude
 * @property float $longitude
 * @property Carbon $created_at
 */
#[Fillable(['user_id', 'reporter_name', 'contact_number', 'description', 'latitude', 'longitude', 'status'])]
class CommunityReport extends Model
{
    protected $table = 'community_report';

    protected $primaryKey = 'report_id';

    public $timestamps = false;

    protected $hidden = ['report_image'];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'created_at' => 'datetime',
            'status' => ReportStatus::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return HasOne<IncidentRecord, $this>
     */
    public function incident(): HasOne
    {
        return $this->hasOne(IncidentRecord::class, 'report_id', 'report_id');
    }
}
