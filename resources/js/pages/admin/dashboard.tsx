import { Head } from '@inertiajs/react';
import { Clock, Flame, TriangleAlert } from 'lucide-react';
import { FireMap } from '@/components/fire-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LIAN_CENTER } from '@/lib/lian-batangas';

type Stat = { label: string; value: string };
type MonthlyIncident = { label: string; value: number };
type IncidentType = { label: string; count: number; color: string };
type MapMarker = {
    id: string;
    position: [number, number];
    label: string;
    status: string;
};

type PageProps = {
    stats: Stat[];
    monthlyIncidents: MonthlyIncident[];
    incidentTypes: IncidentType[];
    mapMarkers: MapMarker[];
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#eab308',
    verified: '#f97316',
    dispatched: '#dc2626',
};

const STAT_ICONS = [Flame, TriangleAlert, Clock, Clock];

export default function AdminDashboard({
    stats,
    monthlyIncidents,
    incidentTypes,
    mapMarkers,
}: PageProps) {
    const chartMax = Math.max(
        5,
        Math.ceil(Math.max(...monthlyIncidents.map((m) => m.value), 1) / 5) *
            5,
    );
    const chartTicks = [4, 3, 2, 1, 0].map((step) =>
        Math.round((chartMax / 4) * step),
    );

    const totalTypeIncidents = incidentTypes.reduce(
        (sum, t) => sum + t.count,
        0,
    );

    // Build a conic-gradient string so the pie chart needs no chart library.
    let cumulative = 0;
    const pieGradientStops = incidentTypes
        .map((type) => {
            const start = totalTypeIncidents
                ? (cumulative / totalTypeIncidents) * 360
                : 0;
            cumulative += type.count;
            const end = totalTypeIncidents
                ? (cumulative / totalTypeIncidents) * 360
                : 0;
            return `${type.color} ${start}deg ${end}deg`;
        })
        .join(', ');

    return (
        <>
            <Head title="Admin Dashboard" />
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

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Incidents Over Time</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Monthly trend analysis
                            </p>
                        </CardHeader>
                        <CardContent>
                            {monthlyIncidents.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    No incident data yet.
                                </p>
                            ) : (
                                <div className="relative">
                                    <div className="flex h-52 items-end gap-4 border-b pl-8">
                                        <div className="pointer-events-none absolute top-0 left-0 flex h-52 flex-col justify-between text-xs text-muted-foreground">
                                            {chartTicks.map((tick) => (
                                                <span key={tick}>{tick}</span>
                                            ))}
                                        </div>
                                        {monthlyIncidents.map((m) => (
                                            <div
                                                key={m.label}
                                                className="flex flex-1 flex-col items-center gap-2"
                                            >
                                                <div
                                                    className="w-full rounded-t-sm bg-red-600"
                                                    style={{
                                                        height: `${(m.value / chartMax) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 pl-8">
                                        {monthlyIncidents.map((m) => (
                                            <span
                                                key={m.label}
                                                className="flex-1 pt-1 text-center text-xs text-muted-foreground"
                                            >
                                                {m.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Incidents by Type</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Distribution analysis
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                            {incidentTypes.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    No incident data yet.
                                </p>
                            ) : (
                                <>
                                    <div
                                        className="relative size-40 shrink-0 rounded-full"
                                        style={{
                                            background: `conic-gradient(${pieGradientStops})`,
                                        }}
                                    >
                                        <div className="absolute inset-4 rounded-full bg-card" />
                                    </div>
                                    <div className="flex w-full flex-col gap-2 sm:w-auto">
                                        {incidentTypes.map((type) => (
                                            <div
                                                key={type.label}
                                                className="flex items-center justify-between gap-6 text-sm"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className="size-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                type.color,
                                                        }}
                                                    />
                                                    {type.label}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {type.count} incidents
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
