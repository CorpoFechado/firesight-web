import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    MapPin,
    Navigation as NavigationIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FireMap } from '@/components/fire-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SAMPLE_ROUTE } from '@/lib/lian-batangas';
import { cn } from '@/lib/utils';

type ResponseStatus = 'En Route' | 'On Scene' | 'Resolved';

export default function Response() {
    const [status, setStatus] = useState<ResponseStatus>('Resolved');

    const handleStatusChange = (next: ResponseStatus) => {
        setStatus(next);
        toast.success(`Status updated to ${next} (demo only)`);
    };

    return (
        <>
            <Head title="Response" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Response</h1>
                    <p className="text-sm text-muted-foreground">
                        Route Optimization &amp; Navigation
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Response</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-muted-foreground" />
                            123 Rizal Street
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" />
                            Dispatched: March 26, 2026 - 2:30 PM
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Route Navigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video overflow-hidden rounded-xl border">
                            <FireMap
                                center={SAMPLE_ROUTE[0]}
                                zoom={16}
                                route={SAMPLE_ROUTE}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Update Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Button
                                variant="outline"
                                className={cn(
                                    status === 'En Route' &&
                                        'border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100',
                                )}
                                onClick={() => handleStatusChange('En Route')}
                            >
                                <NavigationIcon className="size-4" />
                                En Route
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    status === 'On Scene' &&
                                        'border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100',
                                )}
                                onClick={() => handleStatusChange('On Scene')}
                            >
                                <MapPin className="size-4" />
                                On Scene
                            </Button>
                            <Button
                                className={cn(
                                    status === 'Resolved'
                                        ? 'bg-orange-500 hover:bg-orange-600'
                                        : 'bg-muted text-muted-foreground hover:bg-muted',
                                )}
                                onClick={() => handleStatusChange('Resolved')}
                            >
                                <CheckCircle2 className="size-4" />
                                Resolved
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}