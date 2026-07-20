<?php

namespace App\Enums;

enum DutyStatus: string
{
    case OnDuty = 'on_duty';
    case OnLeave = 'on_leave';
    case Deployed = 'deployed';
}
