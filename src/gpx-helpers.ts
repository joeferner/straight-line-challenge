import {Gpx} from "./gpx-parser";

const EARTH_RADIUS = 6371000;

export interface Point {
    lat: number;
    lon: number;
}

export interface Arc {
    start: Point;
    end: Point;
}

export function calculateBestArc(gpx: Gpx): Arc {
    const pt1 = gpx.tracks[0].points[0];
    const pt2 = gpx.tracks[0].points[gpx.tracks[0].points.length - 1];

    return {
        start: {
            lat: pt1.lat,
            lon: pt1.lon
        },
        end: {
            lat: pt2.lat,
            lon: pt2.lon
        }
    }
}

export function rad2deg(radians: number): number {
    return radians * 180.0 / Math.PI;
}

export function deg2rad(degrees: number): number {
    return degrees * Math.PI / 180.0;
}

export function midpoint(pt1: Point, pt2: Point): Point {
    const φ1 = deg2rad(pt1.lat); // φ, λ in radians
    const φ2 = deg2rad(pt2.lat);
    const λ1 = deg2rad(pt1.lon);
    const λ2 = deg2rad(pt2.lon);

    const Bx = Math.cos(φ2) * Math.cos(λ2 - λ1);
    const By = Math.cos(φ2) * Math.sin(λ2 - λ1);
    const φ3 = Math.atan2(
        Math.sin(φ1) + Math.sin(φ2),
        Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By)
    );
    const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

    return {
        lat: rad2deg(φ3),
        lon: rad2deg(λ3)
    }
}

export function crossTrackDistance(pt: Point, arc: Arc): number {
    const δ13 = distance(arc.start, pt) / EARTH_RADIUS;
    const θ13 = deg2rad(initialBearingInDegrees(arc.start, pt));
    const θ12 = deg2rad(initialBearingInDegrees(arc.start, arc.end));

    const δxt = Math.asin(Math.sin(δ13) * Math.sin(θ13 - θ12));

    return δxt * EARTH_RADIUS;
}

export function distance(pt1: Point, pt2: Point): number {
    const φ1 = deg2rad(pt1.lat), λ1 = deg2rad(pt1.lon);
    const φ2 = deg2rad(pt2.lat), λ2 = deg2rad(pt2.lon);
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;

    const a = Math.sin(Δφ / 2)
        * Math.sin(Δφ / 2)
        + Math.cos(φ1)
        * Math.cos(φ2)
        * Math.sin(Δλ / 2)
        * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = EARTH_RADIUS * c;

    return d;
}

export function initialBearingInDegrees(pt1: Point, pt2: Point): number {
    const φ1 = deg2rad(pt1.lat);
    const φ2 = deg2rad(pt2.lat);
    const Δλ = deg2rad(pt2.lon - pt1.lon);

    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const θ = Math.atan2(y, x);

    const bearing = rad2deg(θ);

    return wrap360(bearing);
}

export function wrap360(degrees: number): number {
    if (0 <= degrees && degrees < 360) {
        return degrees
    } // avoid rounding due to arithmetic ops if within range
    return (degrees % 360 + 360) % 360; // sawtooth wave p:360, a:360
}