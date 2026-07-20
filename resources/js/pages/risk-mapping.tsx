import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type L from 'leaflet';
import { FireMap } from '@/components/fire-map';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BARANGAY_RISK_LEVELS,
    LIAN_CENTER,
    RISK_POINTS,
} from '@/lib/lian-batangas';

type Risk = 'High' | 'Medium' | 'Low';

const RISK_STYLES: Record<Risk, string> = {
    High: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    Low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
};

const RISK_COLORS: Record<Risk, string> = {
    High: '#dc2626',
    Medium: '#f97316',
    Low: '#eab308',
};

const UNASSESSED_COLOR = '#94a3b8'; // slate-400, for any barangay not in BARANGAY_RISK_LEVELS

const riskByBarangay = new Map(
    BARANGAY_RISK_LEVELS.map((b) => [b.name, b.risk]),
);

export default function RiskMapping() {
    const [barangayBoundaries, setBarangayBoundaries] =
        useState<GeoJSON.FeatureCollection | null>(null);

    useEffect(() => {
        fetch('/data/LianPerBarangay.geojson')
            .then((res) => res.json())
            .then((data: GeoJSON.FeatureCollection) =>
                setBarangayBoundaries(data),
            )
            .catch(() => {
                // Boundary overlay is optional — the map still renders
                // the risk point markers below if this fails to load.
            });
    }, []);

    return (
        <>
            <Head title="Risk Mapping" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold">Risk Mapping</h1>
                    <p className="text-sm text-muted-foreground">
                        GIS Heatmap &amp; Risk Analysis
                    </p>
                </div>

                <Card>
                    <CardContent>
                        <div className="relative aspect-video overflow-hidden rounded-xl border">
                            {barangayBoundaries ? (
                                <FireMap
                                    center={LIAN_CENTER}
                                    zoom={12}
                                    centerLabel="Lian, Batangas"
                                    markers={RISK_POINTS.map((p) => ({
                                        id: p.id,
                                        position: p.position,
                                        label: p.name,
                                        color: RISK_COLORS[p.risk],
                                    }))}
                                    geoJson={{
                                        data: barangayBoundaries,
                                        style: (feature) => {
                                            const name = feature?.properties
                                                ?.barangay as
                                                | string
                                                | undefined;
                                            const risk = name
                                                ? riskByBarangay.get(name)
                                                : undefined;
                                            const color = risk
                                                ? RISK_COLORS[risk]
                                                : UNASSESSED_COLOR;

                                            return {
                                                color,
                                                weight: 1.5,
                                                fillColor: color,
                                                fillOpacity: risk
                                                    ? 0.35
                                                    : 0.15,
                                            };
                                        },
                                        onEachFeature: (feature, layer) => {
                                            const name =
                                                (feature.properties
                                                    ?.barangay as
                                                    | string
                                                    | undefined) ??
                                                'Unnamed barangay';
                                            const risk =
                                                riskByBarangay.get(name) ??
                                                'Not yet assessed';

                                            (layer as L.Path).bindPopup(
                                                `<strong>${name}</strong><br/>Risk level: ${risk}`,
                                            );
                                        },
                                    }}
                                    fitToGeoJson
                                />
                            ) : (
                                <div className="flex h-full w-full animate-pulse items-center justify-center bg-muted text-sm text-muted-foreground">
                                    Loading map…
                                </div>
                            )}
                            <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 rounded-lg border bg-background/95 p-3 text-xs shadow">
                                <div className="mb-0.5 font-medium">Legend</div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-red-500" />
                                    High Risk
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-orange-500" />
                                    Medium Risk
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-yellow-500" />
                                    Low Risk
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Barangay Risk Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {BARANGAY_RISK_LEVELS.map((barangay) => (
                                <div
                                    key={barangay.name}
                                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                                >
                                    <span className="text-sm font-medium">
                                        {barangay.name}
                                    </span>
                                    <Badge
                                        className={RISK_STYLES[barangay.risk]}
                                        variant="outline"
                                    >
                                        {barangay.risk}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}