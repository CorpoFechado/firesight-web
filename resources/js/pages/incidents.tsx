import { Head, router, useForm } from '@inertiajs/react';
import {
    Clock,
    FilePlus2,
    MapPin,
    Search,
    SquarePen,
    Trash2,
    User,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import IncidentController from '@/actions/App/Http/Controllers/IncidentController';
import InputError from '@/components/input-error';
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

type Status = 'Pending' | 'Verified' | 'Responding' | 'Resolved' | 'Rejected';
type Severity = 'Low' | 'Moderate' | 'High' | 'Critical';
type IncidentTypeValue = 'structural' | 'electrical' | 'grass' | 'vehicular' | 'other';
type SeverityValue = 'low' | 'moderate' | 'high' | 'critical';
type ReportStatusValue = 'pending' | 'verified' | 'dispatched' | 'resolved' | 'rejected';

type Incident = {
    id: number;
    type: string;
    typeFilipino: string;
    typeValue: IncidentTypeValue;
    location: string;
    barangay: string;
    barangayId: number;
    date: string | null;
    dateRaw: string | null;
    severity: Severity;
    severityValue: SeverityValue;
    status: Status;
    statusValue: ReportStatusValue;
    reportedBy: string;
    causeOfFire: string | null;
    casualties: number;
    notes: string | null;
};

type Barangay = { id: number; name: string };

type PageProps = {
    incidents: Incident[];
    barangays: Barangay[];
};

const STATUS_STYLES: Record<Status, string> = {
    Pending: 'bg-muted text-muted-foreground',
    Verified: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Responding:
        'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    Resolved:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    Rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

const SEVERITY_STYLES: Record<Severity, string> = {
    Low: 'text-yellow-600 dark:text-yellow-500',
    Moderate: 'text-orange-500 dark:text-orange-400',
    High: 'text-orange-600 dark:text-orange-500',
    Critical: 'text-red-600 dark:text-red-500',
};

const INCIDENT_TYPE_OPTIONS: { value: IncidentTypeValue; label: string }[] = [
    { value: 'structural', label: 'Structural Fire' },
    { value: 'electrical', label: 'Electrical Fire' },
    { value: 'grass', label: 'Grass Fire' },
    { value: 'vehicular', label: 'Vehicle Fire' },
    { value: 'other', label: 'Other' },
];

const SEVERITY_OPTIONS: { value: SeverityValue; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical - Code Red' },
];

const REPORT_STATUS_OPTIONS: { value: ReportStatusValue; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'dispatched', label: 'Responding' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
];

export default function Incidents({ incidents, barangays }: PageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
    const [reportOpen, setReportOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<Incident | null>(
        null,
    );
    const [deletingIncident, setDeletingIncident] = useState<Incident | null>(
        null,
    );

    const filtered = useMemo(() => {
        return incidents.filter((incident) => {
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
    }, [incidents, search, statusFilter]);

    const counts = useMemo(
        () => ({
            Pending: incidents.filter((i) => i.status === 'Pending').length,
            Verified: incidents.filter((i) => i.status === 'Verified').length,
            Responding: incidents.filter((i) => i.status === 'Responding')
                .length,
            Resolved: incidents.filter((i) => i.status === 'Resolved').length,
        }),
        [incidents],
    );

    const handleDelete = () => {
        if (!deletingIncident) return;

        router.delete(IncidentController.destroy.url(deletingIncident.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingIncident(null),
        });
    };

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
                            <SelectItem value="Rejected">Rejected</SelectItem>
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
                                {incident.casualties > 0 &&
                                    ` · ${incident.casualties} casualt${incident.casualties === 1 ? 'y' : 'ies'}`}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="size-4" />
                                    Reported by: {incident.reportedBy}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() =>
                                            setEditingIncident(incident)
                                        }
                                        aria-label={`Edit incident #${incident.id}`}
                                    >
                                        <SquarePen className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() =>
                                            setDeletingIncident(incident)
                                        }
                                        aria-label={`Delete incident #${incident.id}`}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
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

            <CreateReportDialog
                open={reportOpen}
                onOpenChange={setReportOpen}
                barangays={barangays}
            />

            <EditIncidentDialog
                incident={editingIncident}
                onOpenChange={(open) => {
                    if (!open) setEditingIncident(null);
                }}
                barangays={barangays}
            />

            <Dialog
                open={deletingIncident !== null}
                onOpenChange={(open) => {
                    if (!open) setDeletingIncident(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-red-100 text-red-700">
                                <Trash2 className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle>Delete Incident</DialogTitle>
                                <DialogDescription>
                                    This cannot be undone
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-foreground">
                            {deletingIncident?.type}
                        </span>{' '}
                        at {deletingIncident?.barangay}? The linked community
                        report will also be removed.
                    </p>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setDeletingIncident(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

type CreateForm = {
    incident_type: IncidentTypeValue | '';
    severity_level: SeverityValue | '';
    location: string;
    barangay_id: string;
    data_time: string;
    casualties: number;
    cause_of_fire: string;
    description: string;
    assigned_team: string;
    units_deployed: string;
};

const emptyCreateForm: CreateForm = {
    incident_type: 'structural',
    severity_level: 'high',
    location: '',
    barangay_id: '',
    data_time: '',
    casualties: 0,
    cause_of_fire: '',
    description: '',
    assigned_team: '',
    units_deployed: '',
};

function CreateReportDialog({
    open,
    onOpenChange,
    barangays,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    barangays: Barangay[];
}) {
    const [step, setStep] = useState<1 | 2>(1);
    const form = useForm<CreateForm>(emptyCreateForm);

    const handleClose = (next: boolean) => {
        onOpenChange(next);

        if (!next) {
            setStep(1);
            form.reset();
            form.clearErrors();
        }
    };

    const handleSubmit = () => {
        form.post(IncidentController.store.url(), {
            preserveScroll: true,
            onSuccess: () => handleClose(false),
        });
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
                            <Select
                                value={form.data.incident_type}
                                onValueChange={(value) =>
                                    form.setData(
                                        'incident_type',
                                        value as IncidentTypeValue,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {INCIDENT_TYPE_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={form.errors.incident_type}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Severity Level</Label>
                            <Select
                                value={form.data.severity_level}
                                onValueChange={(value) =>
                                    form.setData(
                                        'severity_level',
                                        value as SeverityValue,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEVERITY_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={form.errors.severity_level}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Specific Location</Label>
                                <Input
                                    placeholder="e.g., 123 Rizal Street"
                                    value={form.data.location}
                                    onChange={(e) =>
                                        form.setData(
                                            'location',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={form.errors.location} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Barangay</Label>
                                <Select
                                    value={form.data.barangay_id}
                                    onValueChange={(value) =>
                                        form.setData('barangay_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select barangay" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {barangays.map((b) => (
                                            <SelectItem
                                                key={b.id}
                                                value={String(b.id)}
                                            >
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={form.errors.barangay_id}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Date &amp; Time</Label>
                            <Input
                                type="datetime-local"
                                value={form.data.data_time}
                                onChange={(e) =>
                                    form.setData('data_time', e.target.value)
                                }
                            />
                            <InputError message={form.errors.data_time} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Casualties</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.data.casualties}
                                    onChange={(e) =>
                                        form.setData(
                                            'casualties',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                <InputError
                                    message={form.errors.casualties}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Cause of Fire</Label>
                                <Input
                                    placeholder="e.g., Unattended cooking"
                                    value={form.data.cause_of_fire}
                                    onChange={(e) =>
                                        form.setData(
                                            'cause_of_fire',
                                            e.target.value,
                                        )
                                    }
                                />
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
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Assigned Response Team</Label>
                            <Select
                                value={form.data.assigned_team}
                                onValueChange={(value) =>
                                    form.setData('assigned_team', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Alpha Team - Lian Fire Station">
                                        Alpha Team - Lian Fire Station
                                    </SelectItem>
                                    <SelectItem value="Bravo Team - Lian Fire Station">
                                        Bravo Team - Lian Fire Station
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Units Deployed</Label>
                            <Input
                                placeholder="e.g., Engine 1, Rescue 2"
                                value={form.data.units_deployed}
                                onChange={(e) =>
                                    form.setData(
                                        'units_deployed',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Attachments</Label>
                            <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed py-8 text-sm text-muted-foreground">
                                <FilePlus2 className="size-5" />
                                Click to upload or drag and drop
                                <span className="text-xs">
                                    Coming soon &mdash; not saved yet
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
                                disabled={form.processing}
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

type EditForm = {
    incident_type: IncidentTypeValue | '';
    severity_level: SeverityValue | '';
    barangay_id: string;
    status: ReportStatusValue | '';
    casualties: number;
    cause_of_fire: string;
    notes: string;
};

function EditIncidentDialog({
    incident,
    onOpenChange,
    barangays,
}: {
    incident: Incident | null;
    onOpenChange: (open: boolean) => void;
    barangays: Barangay[];
}) {
    const form = useForm<EditForm>({
        incident_type: 'structural',
        severity_level: 'low',
        barangay_id: '',
        status: 'pending',
        casualties: 0,
        cause_of_fire: '',
        notes: '',
    });

    // Re-seed the form whenever a different incident is opened for editing.
    useEffect(() => {
        if (!incident) return;

        form.setData({
            incident_type: incident.typeValue,
            severity_level: incident.severityValue,
            barangay_id: String(incident.barangayId),
            status: incident.statusValue,
            casualties: incident.casualties,
            cause_of_fire: incident.causeOfFire ?? '',
            notes: incident.notes ?? '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incident?.id]);

    const handleSubmit = () => {
        if (!incident) return;

        form.patch(IncidentController.update.url(incident.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog
            open={incident !== null}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                            <SquarePen className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle>Edit Incident</DialogTitle>
                            <DialogDescription>
                                Update incident details and status
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Incident Type</Label>
                            <Select
                                value={form.data.incident_type}
                                onValueChange={(value) =>
                                    form.setData(
                                        'incident_type',
                                        value as IncidentTypeValue,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {INCIDENT_TYPE_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Severity Level</Label>
                            <Select
                                value={form.data.severity_level}
                                onValueChange={(value) =>
                                    form.setData(
                                        'severity_level',
                                        value as SeverityValue,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEVERITY_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Barangay</Label>
                            <Select
                                value={form.data.barangay_id}
                                onValueChange={(value) =>
                                    form.setData('barangay_id', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select barangay" />
                                </SelectTrigger>
                                <SelectContent>
                                    {barangays.map((b) => (
                                        <SelectItem
                                            key={b.id}
                                            value={String(b.id)}
                                        >
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={form.data.status}
                                onValueChange={(value) =>
                                    form.setData(
                                        'status',
                                        value as ReportStatusValue,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {REPORT_STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Casualties</Label>
                            <Input
                                type="number"
                                min={0}
                                value={form.data.casualties}
                                onChange={(e) =>
                                    form.setData(
                                        'casualties',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Cause of Fire</Label>
                            <Input
                                value={form.data.cause_of_fire}
                                onChange={(e) =>
                                    form.setData(
                                        'cause_of_fire',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Notes</Label>
                        <textarea
                            className="min-h-20 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={form.data.notes}
                            onChange={(e) =>
                                form.setData('notes', e.target.value)
                            }
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={form.processing}
                    >
                        Save Changes
                    </Button>
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
