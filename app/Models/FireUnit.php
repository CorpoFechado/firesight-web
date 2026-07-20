<?php

namespace App\Models;

use App\Enums\FireUnitStatus;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $unit_id
 * @property string $unit_name
 * @property FireUnitStatus $status
 */
class FireUnit extends Model
{
    protected $table = 'fire_unit';

    protected $primaryKey = 'unit_id';

    protected $fillable = ['unit_name', 'status'];

    protected function casts(): array
    {
        return [
            'status' => FireUnitStatus::class,
        ];
    }
}
