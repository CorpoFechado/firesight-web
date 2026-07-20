import { Head, router } from '@inertiajs/react';
import { Truck } from 'lucide-react';
import AlertController from '@/actions/App/Http/Controllers/Admin/AlertController';
import { FireMap } from '@/components/fire-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SAMPLE_ROUTE } from '@/lib/lian-batangas';
import { cn } from '@/lib/utils';

type UnitStatus = 'available' | 'assigned' | 'on_scene';

type Unit = {
    id: number;
    name: string;
    status: UnitStatus;
};

type PersonnelStat = {
    label: string;
    value: number;
};

type ActiveIncident = {
    label: string;
    position: [number, number];
} | null;

type PageProps = {
    units: Unit[];
    personnel: PersonnelStat[];
    activeIncident: ActiveIncident;
};

const PERSONNEL_STYLES: Record<string, string> = {
    Deployed: 'text-orange-600',
};

export default function AdminAlerts({
    units,
    personnel,
    activeIncident,
}: PageProps) {
    const assignUnit = (unit: Unit) => {
        router.patch(
            AlertController.assignUnit.url(unit.id),
            {},
            { preserveScroll: true },
        );
    };

    const mapCenter = activeIncident
        ? activeIncident.position
        : SAMPLE_ROUTE[0];
    const markerPosition = activeIncident
        ? activeIncident.position
        : SAMPLE_ROUTE[SAMPLE_ROUTE.length - 1];

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
                            {activeIncident ? (
                                <p className="text-sm text-muted-foreground">
                                    Nearest open report: {activeIncident.label}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No active reports right now
                                </p>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video overflow-hidden rounded-xl border">
                                <FireMap
                                    center={mapCenter}
                                    zoom={16}
                                    route={SAMPLE_ROUTE}
                                    markers={[
                                        {
                                            id: 'active-incident',
                                            position: markerPosition,
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
                                            unit.status !== 'on_scene' &&
                                                'border-green-200 bg-green-50',
                                        )}
                                    >
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Truck className="size-4 text-muted-foreground" />
                                            {unit.name}
                                        </div>
                                        {unit.status === 'on_scene' ? (
                                            <span className="text-sm text-muted-foreground">
                                                On Scene
                                            </span>
                                        ) : unit.status === 'assigned' ? (
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
                                {units.length === 0 && (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No fire units on record.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Personnel</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 text-sm">
                                {personnel.map((item) => (
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
                                                PERSONNEL_STYLES[item.label],
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
