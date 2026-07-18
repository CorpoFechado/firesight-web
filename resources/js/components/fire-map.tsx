import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

export type MapMarker = {
    id: string | number;
    position: [number, number];
    color?: string;
    label?: string;
    popup?: string;
    icon?: 'pin' | 'dot';
};

export type FireMapGeoJson = {
    /** A GeoJSON FeatureCollection, e.g. barangay boundary polygons */
    data: GeoJSON.FeatureCollection;
    /** Per-feature styling (fill color, opacity, border) */
    style?: (feature?: GeoJSON.Feature) => L.PathOptions;
    /** Attach popups/tooltips/click handlers to each polygon */
    onEachFeature?: (feature: GeoJSON.Feature, layer: L.Layer) => void;
};

type FireMapProps = {
    center: [number, number];
    zoom?: number;
    markers?: MapMarker[];
    /** Ordered list of [lat, lng] points to draw a route polyline */
    route?: [number, number][];
    className?: string;
    centerLabel?: string;
    /** Optional polygon/boundary overlay, e.g. barangay risk zones */
    geoJson?: FireMapGeoJson;
    /** Fit the map viewport to the geoJson layer bounds instead of center/zoom */
    fitToGeoJson?: boolean;
};

function createDivIcon(color: string, kind: 'pin' | 'dot' = 'pin') {
    if (kind === 'dot') {
        return L.divIcon({
            className: '',
            html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15)"></span>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
        });
    }

    return L.divIcon({
        className: '',
        html: `
            <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z" fill="${color}"/>
                <circle cx="14" cy="14" r="5.5" fill="white"/>
            </svg>`,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -34],
    });
}

export function FireMap({
    center,
    zoom = 14,
    markers = [],
    route,
    geoJson,
    fitToGeoJson = false,
    className,
    centerLabel,
}: FireMapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) {
            return;
        }

        const map = L.map(containerRef.current, {
            center,
            zoom,
            scrollWheelZoom: false,
        });
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        if (geoJson) {
            const geoJsonLayer = L.geoJSON(geoJson.data, {
                style: geoJson.style,
                onEachFeature: geoJson.onEachFeature,
            }).addTo(map);

            if (fitToGeoJson) {
                map.fitBounds(geoJsonLayer.getBounds(), { padding: [16, 16] });
            }
        }

        if (centerLabel) {
            L.marker(center, { icon: createDivIcon('#f97316', 'pin') })
                .addTo(map)
                .bindPopup(centerLabel);
        }

        markers.forEach((marker) => {
            const leafletMarker = L.marker(marker.position, {
                icon: createDivIcon(
                    marker.color ?? '#2563eb',
                    marker.icon ?? 'pin',
                ),
            }).addTo(map);

            if (marker.popup || marker.label) {
                leafletMarker.bindPopup(marker.popup ?? marker.label ?? '');
            }
        });

        if (route && route.length > 1) {
            L.polyline(route, {
                color: '#2563eb',
                weight: 5,
                opacity: 0.9,
            }).addTo(map);
            L.marker(route[0], { icon: createDivIcon('#dc2626', 'pin') }).addTo(
                map,
            );
            map.fitBounds(L.latLngBounds(route), { padding: [24, 24] });
        }

        return () => {
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width: '100%', height: '100%' }}
        />
    );
}