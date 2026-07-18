import { Head } from '@inertiajs/react';
import { Truck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FireMap } from '@/components/fire-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SAMPLE_ROUTE } from '@/lib/lian-batangas';
import { cn } from '@/lib/utils';

type UnitStatus = 'Available' | 'Assigned' | 'On Scene';

type Unit = {
    id: string;
    name: string;
    status: UnitStatus;
};

const INITIAL_UNITS: Unit[] = [
    { id: 'ft-01', name: 'Fire Truck 01', status: 'Available' },
    { id: 'ft-02', name: 'Fire Truck 02', status: 'Available' },
    { id: 'ft-03', name: 'Fire Truck 03', status: 'On Scene' },
];

const PERSONNEL = [
    { label: 'On Duty', value: 20, className: '' },
    { label: 'On Leave', value: 4, className: '' },
    { label: 'Deployed', value: 8, className: 'text-orange-600' },
];

export default function AdminAlerts() {
    const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);

    const assignUnit = (unit: Unit) => {
        setUnits((prev) =>
            prev.map((u) =>
                u.id === unit.id ? { ...u, status: 'Assigned' } : u,
            ),
        );
        toast.success(`${unit.name} assigned to the active incident`);
    };

    return (
        <>
            <Head title="Alert & Allocation" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Alert &amp; Allocation</h1>
                    <p className="text-sm text-muted-foreground">
                        Real-time monitoring and unit assignment
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Active Incidents Map</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video overflow-hidden rounded-xl border">
                                <FireMap
                                    center={SAMPLE_ROUTE[0]}
                                    zoom={16}
                                    route={SAMPLE_ROUTE}
                                    markers={[
                                        {
                                            id: 'active-incident',
                                            position:
                                                SAMPLE_ROUTE[
                                                    SAMPLE_ROUTE.length - 1
                                                ],
                                            color: '#dc2626',
                                        },
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Units</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                {units.map((unit) => (
                                    <div
                                        key={unit.id}
                                        className={cn(
                                            'flex items-center justify-between rounded-lg border px-4 py-3',
                                            unit.status !== 'On Scene' &&
                                                'border-green-200 bg-green-50',
                                        )}
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Truck className="size-4 text-muted-foreground" />
                                            {unit.name}
                                        </div>
                                        {unit.status === 'On Scene' ? (
                                            <span className="text-sm text-muted-foreground">
                                                On Scene
                                            </span>
                                        ) : unit.status === 'Assigned' ? (
                                            <span className="text-sm font-medium text-orange-600">
                                                Assigned
                                            </span>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-orange-500 hover:bg-orange-600"
                                                onClick={() =>
                                                    assignUnit(unit)
                                                }
                                            >
                                                Assign
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Personnel</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 text-sm">
                                {PERSONNEL.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.label}
                                        </span>
                                        <span
                                            className={cn(
                                                'font-semibold',
                                                item.className,
                                            )}
                                        >
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}