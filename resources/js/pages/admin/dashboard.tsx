import { Head } from '@inertiajs/react';
import { Clock, Flame, TriangleAlert } from 'lucide-react';
import { FireMap } from '@/components/fire-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LIAN_CENTER, RISK_POINTS } from '@/lib/lian-batangas';

const stats = [
    { label: 'Total Incidents', value: '127', icon: Flame },
    { label: 'Active Incidents', value: '3', icon: TriangleAlert },
    { label: 'Resolved Today', value: '2', icon: Clock },
    { label: 'Avg Response Time', value: '8.5 min', icon: Clock },
];

const MONTHLY_INCIDENTS = [
    { label: 'Oct', value: 8 },
    { label: 'Nov', value: 11 },
    { label: 'Dec', value: 14 },
    { label: 'Jan', value: 9 },
    { label: 'Feb', value: 12 },
    { label: 'Mar', value: 15 },
];
const CHART_MAX = 20;

const INCIDENT_TYPES = [
    { label: 'Residential', count: 65, color: '#dc2626' },
    { label: 'Electrical', count: 42, color: '#f97316' },
    { label: 'Forest', count: 20, color: '#0f172a' },
];
const TOTAL_TYPE_INCIDENTS = INCIDENT_TYPES.reduce(
    (sum, t) => sum + t.count,
    0,
);

// Build a conic-gradient string so the pie chart needs no chart library.
let cumulative = 0;
const pieGradientStops = INCIDENT_TYPES.map((type) => {
    const start = (cumulative / TOTAL_TYPE_INCIDENTS) * 360;
    cumulative += type.count;
    const end = (cumulative / TOTAL_TYPE_INCIDENTS) * 360;
    return `${type.color} ${start}deg ${end}deg`;
}).join(', ');

export default function AdminDashboard() {
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
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-normal text-muted-foreground">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
                                markers={RISK_POINTS.slice(0, 4).map((p) => ({
                                    id: p.id,
                                    position: p.position,
                                    label: p.name,
                                    color:
                                        p.risk === 'High'
                                            ? '#dc2626'
                                            : p.risk === 'Medium'
                                              ? '#f97316'
                                              : '#eab308',
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
                            <div className="relative">
                                <div className="flex h-52 items-end gap-4 border-b pl-8">
                                    <div className="pointer-events-none absolute top-0 left-0 flex h-52 flex-col justify-between text-xs text-muted-foreground">
                                        <span>20</span>
                                        <span>15</span>
                                        <span>10</span>
                                        <span>5</span>
                                        <span>0</span>
                                    </div>
                                    {MONTHLY_INCIDENTS.map((m) => (
                                        <div
                                            key={m.label}
                                            className="flex flex-1 flex-col items-center gap-2"
                                        >
                                            <div
                                                className="w-full rounded-t-sm bg-red-600"
                                                style={{
                                                    height: `${(m.value / CHART_MAX) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 pl-8">
                                    {MONTHLY_INCIDENTS.map((m) => (
                                        <span
                                            key={m.label}
                                            className="flex-1 pt-1 text-center text-xs text-muted-foreground"
                                        >
                                            {m.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
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
                            <div
                                className="relative size-40 shrink-0 rounded-full"
                                style={{
                                    background: `conic-gradient(${pieGradientStops})`,
                                }}
                            >
                                <div className="absolute inset-4 rounded-full bg-card" />
                            </div>
                            <div className="flex w-full flex-col gap-2 sm:w-auto">
                                {INCIDENT_TYPES.map((type) => (
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}