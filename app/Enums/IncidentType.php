<?php

namespace App\Enums;

enum IncidentType: string
{
    case Structural = 'structural';
    case Electrical = 'electrical';
    case Grass = 'grass';
    case Vehicular = 'vehicular';
    case Other = 'other';
}
