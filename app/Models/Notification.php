<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $notification_id
 * @property int $user_id
 * @property string $title
 * @property string $message
 * @property string $notification_type
 * @property bool $is_read
 * @property Carbon $created_at
 */
class Notification extends Model
{
    protected $table = 'notification';

    protected $primaryKey = 'notification_id';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'created_at' => 'datetime',
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
