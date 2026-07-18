// Hardcoded reference data for Lian, Batangas used across the map views.
// Replace with real data from the backend once available.

export const LIAN_CENTER: [number, number] = [13.9457, 120.6412];

export const RISK_POINTS: {
    id: string;
    name: string;
    position: [number, number];
    risk: 'High' | 'Medium' | 'Low';
}[] = [
    {
        id: 'r1',
        name: 'Lian Senior High School',
        position: [13.9497, 120.6449],
        risk: 'Medium',
    },
    {
        id: 'r2',
        name: 'Bahay ni Jared',
        position: [14.039140, 120.655862],
        risk: 'Medium',
    },
];

// Risk levels below are placeholders and should be replaced with real
// assessed data from the backend once available. Names must match the
// "barangay" property in public/data/lian-per-barangay.geojson exactly,
// or the boundary won't pick up a risk color on the map.
export const BARANGAY_RISK_LEVELS: {
    name: string;
    risk: 'High' | 'Medium' | 'Low';
}[] = [
    { name: 'Bagong Pook', risk: 'High' },
    { name: 'Balibago', risk: 'High' },
    { name: 'Binubusan', risk: 'High' },
    { name: 'Bungahan', risk: 'Medium' },
    { name: 'Cumba', risk: 'Medium' },
    { name: 'Humayingan', risk: 'Medium' },
    { name: 'Prenza', risk: 'Medium' },
    { name: 'Malaruhatan', risk: 'Low' },
    { name: 'Dos', risk: 'Low' },
    { name: 'Kwatro', risk: 'Low' },
    // The source GeoJSON has one polygon with no "barangay" name set;
    // based on its position it's most likely Lumbangan — verify against
    // the source data and rename here if that's incorrect.
    { name: 'Lumbangan', risk: 'Low' },
    { name: 'Lumaniag', risk: 'Low' },
    { name: 'Luyahan', risk: 'Low' },
    { name: 'Matabungkay', risk: 'Low' },
    { name: 'Puting Kahoy', risk: 'Low' },
    { name: 'San Diego', risk: 'Low' },
    { name: 'Singko', risk: 'Low' },
    { name: 'Tres', risk: 'Low' },
    { name: 'Uno', risk: 'Low' },
];

// A short sample route near the reported incident, used on the Response page.
export const SAMPLE_ROUTE: [number, number][] = [
    [13.9469, 120.6398],
    [13.9463, 120.6408],
    [13.9458, 120.642],
    [13.945, 120.6438],
    [13.9441, 120.6458],
];