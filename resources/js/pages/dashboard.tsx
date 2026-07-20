import { Head, Link } from '@inertiajs/react';
import {
    Clock,
    FilePlus2,
    Flame,
    MapPinned,
    TriangleAlert,
} from 'lucide-react';
import { FireMap } from '@/components/fire-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LIAN_CENTER } from '@/lib/lian-batangas';
import { incidents, riskMapping } from '@/routes';

type Stat = { label: string; value: string };
type MapMarker = {
    id: string;
    position: [number, number];
    label: string;
    status: string;
};
type RecentIncident = { id: number; label: string; time: string | null };

type PageProps = {
    stats: Stat[];
    mapMarkers: MapMarker[];
    recentIncidents: RecentIncident[];
};

const STAT_ICONS = [Flame, TriangleAlert, Clock, Clock];

const STATUS_COLORS: Record<string, string> = {
    pending: '#eab308',
    verified: '#f97316',
    dispatched: '#dc2626',
};

export default function Dashboard({
    stats,
    mapMarkers,
    recentIncidents,
}: PageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Lian, Batangas &middot; Real-time Fire Incident
                        Management
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const Icon = STAT_ICONS[index] ?? Flame;
                        return (
                            <Card key={stat.label}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-normal text-muted-foreground">
                                        {stat.label}
                                    </CardTitle>
                                    <Icon className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Real-time Incident Map</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Mapa ng mga Insidente
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video overflow-hidden rounded-xl border">
                            <FireMap
                                center={LIAN_CENTER}
                                zoom={12}
                                centerLabel="Lian, Batangas"
                                markers={mapMarkers.map((m) => ({
                                    id: m.id,
                                    position: m.position,
                                    label: m.label,
                                    color:
                                        STATUS_COLORS[m.status] ?? '#eab308',
                                }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link
                                href={incidents()}
                                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                            >
                                <FilePlus2 className="size-4 text-orange-500" />
                                Create Incident Report
                            </Link>
                            <Link
                                href={riskMapping()}
                                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                            >
                                <MapPinned className="size-4 text-orange-500" />
                                View Risk Mapping
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Incidents</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 text-sm">
                            {recentIncidents.length === 0 ? (
                                <p className="text-muted-foreground">
                                    No incidents logged yet.
                                </p>
                            ) : (
                                recentIncidents.map((incident) => (
                                    <div
                                        key={incident.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span>{incident.label}</span>
                                        <span className="text-muted-foreground">
                                            {incident.time}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
