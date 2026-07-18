import { Head } from '@inertiajs/react';
import { Clock, FilePlus2, MapPin, Search, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { incidents as incidentsRoute } from '@/routes';

type Status = 'Pending' | 'Verified' | 'Responding' | 'Resolved';

type Incident = {
    id: number;
    type: string;
    typeFilipino: string;
    location: string;
    barangay: string;
    date: string;
    severity: 'Low' | 'Medium' | 'High';
    status: Status;
    reportedBy: string;
};

const INCIDENTS: Incident[] = [
    {
        id: 1,
        type: 'Residential Fire',
        typeFilipino: 'Sunog sa Bahay',
        location: '123 Rizal Street',
        barangay: 'Barangay Prenza',
        date: 'March 26, 2026 - 2:30 PM',
        severity: 'High',
        status: 'Responding',
        reportedBy: 'Juan dela Cruz',
    },
    {
        id: 2,
        type: 'Electrical Fire',
        typeFilipino: 'Sunog sa Kuryente',
        location: '456 Bonifacio Avenue',
        barangay: 'Barangay Malaruhatan',
        date: 'March 26, 2026 - 1:15 PM',
        severity: 'Medium',
        status: 'Verified',
        reportedBy: 'Maria Santos',
    },
    {
        id: 3,
        type: 'Grass Fire',
        typeFilipino: 'Sunog sa Damuhan',
        location: 'Sitio Kalsada',
        barangay: 'Barangay Cumba',
        date: 'March 25, 2026 - 4:05 PM',
        severity: 'Low',
        status: 'Pending',
        reportedBy: 'Pedro Reyes',
    },
    {
        id: 4,
        type: 'Commercial Fire',
        typeFilipino: 'Sunog sa Tindahan',
        location: 'Public Market',
        barangay: 'Barangay Poblacion',
        date: 'March 24, 2026 - 9:40 AM',
        severity: 'High',
        status: 'Resolved',
        reportedBy: 'Ana Lopez',
    },
    {
        id: 5,
        type: 'Vehicle Fire',
        typeFilipino: 'Sunog sa Sasakyan',
        location: 'National Highway',
        barangay: 'Barangay Balibago',
        date: 'March 23, 2026 - 6:20 PM',
        severity: 'Medium',
        status: 'Resolved',
        reportedBy: 'Carlo Ramirez',
    },
];

const STATUS_STYLES: Record<Status, string> = {
    Pending: 'bg-muted text-muted-foreground',
    Verified: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Responding:
        'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    Resolved:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
};

const SEVERITY_STYLES: Record<Incident['severity'], string> = {
    Low: 'text-yellow-600 dark:text-yellow-500',
    Medium: 'text-orange-600 dark:text-orange-500',
    High: 'text-red-600 dark:text-red-500',
};

export default function Incidents() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
    const [reportOpen, setReportOpen] = useState(false);

    const filtered = useMemo(() => {
        return INCIDENTS.filter((incident) => {
            const matchesStatus =
                statusFilter === 'All' || incident.status === statusFilter;
            const matchesSearch =
                search.trim() === '' ||
                incident.type.toLowerCase().includes(search.toLowerCase()) ||
                incident.location
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                incident.barangay.toLowerCase().includes(search.toLowerCase());

            return matchesStatus && matchesSearch;
        });
    }, [search, statusFilter]);

    const counts = useMemo(
        () => ({
            Pending: INCIDENTS.filter((i) => i.status === 'Pending').length,
            Verified: INCIDENTS.filter((i) => i.status === 'Verified').length,
            Responding: INCIDENTS.filter((i) => i.status === 'Responding')
                .length,
            Resolved: INCIDENTS.filter((i) => i.status === 'Resolved').length,
        }),
        [],
    );

    return (
        <>
            <Head title="Incidents" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Incident Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pamamahala ng mga Insidente
                        </p>
                    </div>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => setReportOpen(true)}
                    >
                        <FilePlus2 />
                        Create Report
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search incidents..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as Status | 'All')
                        }
                    >
                        <SelectTrigger className="sm:w-48">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Responding">
                                Responding
                            </SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {(
                        ['Pending', 'Verified', 'Responding', 'Resolved'] as const
                    ).map((status) => (
                        <Card
                            key={status}
                            className="items-center justify-center py-4 text-center"
                        >
                            <div className="text-3xl font-bold">
                                {counts[status]}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {status}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    {filtered.map((incident) => (
                        <Card key={incident.id} className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold">
                                        {incident.type}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {incident.typeFilipino}
                                    </p>
                                </div>
                                <Badge
                                    className={STATUS_STYLES[incident.status]}
                                    variant="outline"
                                >
                                    {incident.status}
                                </Badge>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-muted-foreground" />
                                    <span>
                                        {incident.location}
                                        <span className="block text-muted-foreground">
                                            {incident.barangay}
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-muted-foreground" />
                                    {incident.date}
                                </div>
                            </div>

                            <div
                                className={`mt-2 text-sm font-medium ${SEVERITY_STYLES[incident.severity]}`}
                            >
                                {incident.severity} Severity
                            </div>

                            <div className="mt-3 flex items-center gap-2 border-t pt-3 text-sm text-muted-foreground">
                                <User className="size-4" />
                                Reported by: {incident.reportedBy}
                            </div>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No incidents match your search.
                        </p>
                    )}
                </div>
            </div>

            <CreateReportDialog open={reportOpen} onOpenChange={setReportOpen} />
        </>
    );
}

function CreateReportDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [step, setStep] = useState<1 | 2>(1);

    const handleClose = (next: boolean) => {
        onOpenChange(next);

        if (!next) {
            setStep(1);
        }
    };

    const handleSubmit = () => {
        toast.success('Incident report submitted (demo only)');
        handleClose(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Incident Report</DialogTitle>
                    <DialogDescription>
                        Create a new BFP incident report
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2 text-sm">
                    <span
                        className={`flex size-6 items-center justify-center rounded-full text-xs font-medium text-white ${step >= 1 ? 'bg-orange-500' : 'bg-muted'}`}
                    >
                        1
                    </span>
                    <span className={step === 1 ? 'font-medium' : 'text-muted-foreground'}>
                        Basic Info
                    </span>
                    <div className="mx-2 h-px flex-1 bg-border" />
                    <span
                        className={`flex size-6 items-center justify-center rounded-full text-xs font-medium ${step === 2 ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}
                    >
                        2
                    </span>
                    <span className={step === 2 ? 'font-medium' : 'text-muted-foreground'}>
                        Details
                    </span>
                </div>

                {step === 1 ? (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Incident Type</Label>
                            <Select defaultValue="commercial">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="residential">
                                        Residential Fire
                                    </SelectItem>
                                    <SelectItem value="commercial">
                                        Commercial Fire
                                    </SelectItem>
                                    <SelectItem value="electrical">
                                        Electrical Fire
                                    </SelectItem>
                                    <SelectItem value="grass">
                                        Grass Fire
                                    </SelectItem>
                                    <SelectItem value="vehicle">
                                        Vehicle Fire
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Severity Level</Label>
                            <Select defaultValue="critical">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">
                                        Low
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="critical">
                                        Critical - Code Red
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Specific Location</Label>
                                <Input placeholder="e.g., 123 Rizal Street" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Barangay</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select barangay" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prenza">
                                            Prenza
                                        </SelectItem>
                                        <SelectItem value="malaruhatan">
                                            Malaruhatan
                                        </SelectItem>
                                        <SelectItem value="cumba">
                                            Cumba
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Date &amp; Time</Label>
                            <Input type="datetime-local" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Casualties</Label>
                                <Input type="number" defaultValue={0} min={0} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Injuries</Label>
                                <Input type="number" defaultValue={0} min={0} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Incident Description</Label>
                            <textarea
                                className="min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Provide detailed description of the incident..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Assigned Response Team</Label>
                            <Select defaultValue="bravo">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alpha">
                                        Alpha Team - Lian Fire Station
                                    </SelectItem>
                                    <SelectItem value="bravo">
                                        Bravo Team - Lian Fire Station
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Units Deployed</Label>
                            <Input placeholder="e.g., Engine 1, Rescue 2" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Attachments</Label>
                            <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed py-8 text-sm text-muted-foreground">
                                <FilePlus2 className="size-5" />
                                Click to upload or drag and drop
                                <span className="text-xs">
                                    Images, PDFs, or Documents
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 1 ? (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => handleClose(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={() => setStep(2)}>Next</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button
                                className="bg-orange-500 hover:bg-orange-600"
                                onClick={handleSubmit}
                            >
                                Submit Report
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

Incidents.layout = {
    breadcrumbs: [
        {
            title: 'Incidents',
            href: incidentsRoute(),
        },
    ],
};