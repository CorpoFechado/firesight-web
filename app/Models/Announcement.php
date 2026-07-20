<?php

namespace App\Models;

use App\Enums\AnnouncementStatus;
use App\Enums\AnnouncementType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $announcement_id
 * @property int $created_by
 * @property string $title
 * @property string $content
 * @property AnnouncementType $announcement_type
 * @property AnnouncementStatus $status
 * @property Carbon $created_at
 */
#[Fillable(['created_by', 'title', 'content', 'announcement_type', 'status'])]
class Announcement extends Model
{
    protected $table = 'announcement';

    protected $primaryKey = 'announcement_id';

    /**
     * The table only has `created_at` (with a DB-level default), no `updated_at`.
     */
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'announcement_type' => AnnouncementType::class,
            'status' => AnnouncementStatus::class,
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
