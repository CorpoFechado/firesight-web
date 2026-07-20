<?php

namespace App\Enums;

enum FireUnitStatus: string
{
    case Available = 'available';
    case Assigned = 'assigned';
    case OnScene = 'on_scene';
}
