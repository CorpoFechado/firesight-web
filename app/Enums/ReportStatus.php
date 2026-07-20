<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';
    case Dispatched = 'dispatched';
    case Resolved = 'resolved';
    case Rejected = 'rejected';
}
