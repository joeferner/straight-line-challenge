import {Gpx, GpxPoint} from "./gpx-parser";
import {LineUtil} from "leaflet";

const EARTH_RADIUS = 6371;

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

export function calculateDistanceFromArc(pt: GpxPoint, arc: Arc): number {
    // A - arc start
    // B - arc end
    // C - pt
    const bearingAC = bearing(arc.start, pt);
    const bearingAB = bearing(arc.start, arc.end);
    const distanceAC = distance(arc.start, pt);
    return Math.abs(
        Math.asin(Math.sin(distanceAC / EARTH_RADIUS) * Math.sin(bearingAC - bearingAB)) * EARTH_RADIUS
    );
}

function bearing(pt1: Point, pt2: Point): number {
    const dLon = pt1.lon - pt2.lon;
    return Math.atan2(
        Math.sin(dLon) * Math.cos(pt2.lat),
        Math.cos(pt1.lat) * Math.sin(pt2.lat) - Math.sin(pt1.lat) * Math.cos(pt2.lat) * Math.cos(dLon)
    );
}

function distance(pt1: Point, pt2: Point): number {
    const a = Math.sin(pt1.lat) * Math.sin(pt2.lat);
    const b = Math.cos(pt1.lat) * Math.cos(pt2.lat) * Math.cos(pt1.lon - pt2.lon);
    return Math.acos(a + b) * EARTH_RADIUS;
}
