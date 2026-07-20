<?php

namespace App\Models;

use App\Enums\DutyStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $details_id
 * @property int $user_id
 * @property string $rank
 * @property string $station_assigned
 * @property string $employee_number
 * @property DutyStatus $duty_status
 */
class BfpPersonnelDetail extends Model
{
    protected $table = 'bfp_personnel_details';

    protected $primaryKey = 'details_id';

    protected $fillable = ['user_id', 'rank', 'station_assigned', 'employee_number', 'duty_status'];

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'duty_status' => DutyStatus::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
