<?php

namespace App\Enums;

enum SeverityLevel: string
{
    case Low = 'low';
    case Moderate = 'moderate';
    case High = 'high';
    case Critical = 'critical';
}
