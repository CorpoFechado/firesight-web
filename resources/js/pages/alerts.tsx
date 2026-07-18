import { Head } from '@inertiajs/react';
import { Bell, CheckCircle2, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { alerts as alertsRoute } from '@/routes';

type AlertItem = {
    id: number;
    title: string;
    location: string;
    time: string;
    urgent: boolean;
    severity?: 'medium';
    read: boolean;
};

const INITIAL_ALERTS: AlertItem[] = [
    {
        id: 1,
        title: 'Multiple Reports - Residential Fire',
        location: 'Prenza',
        time: '2 minutes ago',
        urgent: true,
        read: false,
    },
    {
        id: 2,
        title: 'Electrical Fire Verification Needed',
        location: 'Malaruhatan',
        time: '15 minutes ago',
        urgent: true,
        read: false,
    },
    {
        id: 3,
        title: 'Forest Fire Contained',
        location: 'Cumba',
        time: '3 hours ago',
        urgent: false,
        severity: 'medium',
        read: true,
    },
];

export default function Alerts() {
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);

    const unread = useMemo(
        () => alerts.filter((a) => !a.read).length,
        [alerts],
    );
    const resolved = useMemo(
        () => alerts.filter((a) => a.read && !a.urgent).length,
        [alerts],
    );

    const markRead = (id: number) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
        );
    };

    return (
        <>
            <Head title="Alerts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Alerts</h1>
                    <p className="text-sm text-muted-foreground">
                        Real-time Notifications
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/30">
                        <CardContent className="flex items-center gap-3">
                            <TriangleAlert className="size-6 text-red-600" />
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {unread}
                                </div>
                                <div className="text-sm text-red-600/80">
                                    Unread
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <Bell className="size-6 text-muted-foreground" />
                            <div>
                                <div className="text-2xl font-bold">
                                    {alerts.length}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Total Today
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3">
                            <CheckCircle2 className="size-6 text-muted-foreground" />
                            <div>
                                <div className="text-2xl font-bold">
                                    {resolved}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Resolved
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4">
                    {alerts.map((alert) =>
                        alert.urgent && !alert.read ? (
                            <Card
                                key={alert.id}
                                className="border-red-300 dark:border-red-900"
                            >
                                <CardContent>
                                    <h3 className="font-semibold">
                                        {alert.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {alert.location} &middot; {alert.time}
                                    </p>
                                    <div className="mt-4 flex gap-3">
                                        <Button
                                            className="flex-1 bg-red-600 hover:bg-red-700"
                                            onClick={() => markRead(alert.id)}
                                        >
                                            Take Action
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card key={alert.id}>
                                <CardContent>
                                    {alert.severity && (
                                        <Badge variant="secondary" className="mb-2">
                                            {alert.severity}
                                        </Badge>
                                    )}
                                    <h3 className="font-semibold">
                                        {alert.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {alert.location} &middot; {alert.time}
                                    </p>
                                    <Button
                                        variant="secondary"
                                        className="mt-4 w-full"
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ),
                    )}
                </div>
            </div>
        </>
    );
}

Alerts.layout = {
    breadcrumbs: [
        {
            title: 'Alerts',
            href: alertsRoute(),
        },
    ],
};