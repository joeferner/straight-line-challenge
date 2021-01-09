import {Gpx} from "./gpx-parser";

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
