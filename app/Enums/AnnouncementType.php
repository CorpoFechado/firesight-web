<?php

namespace App\Enums;

enum AnnouncementType: string
{
    case General = 'general';
    case Advisory = 'advisory';
    case Emergency = 'emergency';
    case FireSafetyTip = 'fire_safety_tip';
}
