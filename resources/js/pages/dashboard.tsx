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
import { LIAN_CENTER, RISK_POINTS } from '@/lib/lian-batangas';
import { incidents, riskMapping } from '@/routes';

const stats = [
    { label: 'Total Incidents', value: '127', icon: Flame },
    { label: 'Active Incidents', value: '3', icon: TriangleAlert },
    { label: 'Resolved Today', value: '2', icon: Clock },
    { label: 'Avg Response Time', value: '8.5 min', icon: Clock },
];

export default function Dashboard() {
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
                            <div className="flex items-center justify-between">
                                <span>Residential Fire &middot; Prenza</span>
                                <span className="text-muted-foreground">
                                    2:30 PM
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>
                                    Electrical Fire &middot; Malaruhatan
                                </span>
                                <span className="text-muted-foreground">
                                    1:15 PM
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}