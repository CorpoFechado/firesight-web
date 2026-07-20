<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $barangay_id
 * @property string $barangay_name
 */
class Barangay extends Model
{
    protected $table = 'barangay';

    protected $primaryKey = 'barangay_id';

    public $timestamps = false;
}
