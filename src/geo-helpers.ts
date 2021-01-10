// see http://www.movable-type.co.uk/scripts/latlong.html

const EARTH_RADIUS = 6371000;

export interface Point {
    time?: Date;
    lat: number;
    lon: number;
}

export interface Arc {
    start: Point;
    end: Point;
}

export function calculateBestArc(points: Point[]): Arc {
    const pt1 = points[0];
    const pt2 = points[points.length - 1];
    const firstGuess = {
        start: {
            lat: pt1.lat,
            lon: pt1.lon
        },
        end: {
            lat: pt2.lat,
            lon: pt2.lon
        }
    }

    function findMaxVectorFromArc(arc: Arc, points: Point[]): [number, number, number] {
        let lat = 0;
        let lon = 0;
        let maxDistance = -1;
        for (const point of points) {
            const d = Math.abs(crossTrackDistance(point, arc));
            if (d > maxDistance) {
                const closestPoint = findClosestPointOnArc(arc, point);
                lat = point.lat - closestPoint.lat;
                lon = point.lon - closestPoint.lon;
                maxDistance = d;
            }
        }
        return [lat, lon, maxDistance];
    }

    function adjustArc(arc: Arc, div: number): { arc: Arc, error: number } {
        const startToMidPoints = [];
        const endToMidPoints = [];
        for (const point of points) {
            if (distance(point, arc.start) < distance(point, arc.end)) {
                startToMidPoints.push(point);
            } else {
                endToMidPoints.push(point);
            }
        }

        const startToMidMaxVector = findMaxVectorFromArc(arc, startToMidPoints);
        const endToMidMaxVector = findMaxVectorFromArc(arc, endToMidPoints);

        console.log('startToMidMaxVector:', startToMidMaxVector);
        console.log('endToMidMaxVector:', endToMidMaxVector)

        const dLat = arc.end.lat - arc.start.lat;
        const dLon = arc.end.lon - arc.start.lon;
        const guess: Arc = {
            start: {
                lat: arc.start.lat + (startToMidMaxVector[0] / div) - dLat,
                lon: arc.start.lon + (startToMidMaxVector[1] / div) - dLon
            },
            end: {
                lat: arc.end.lat + (endToMidMaxVector[0] / div) + dLat,
                lon: arc.end.lon + (endToMidMaxVector[1] / div) + dLon
            }
        }
        const avgDistance = (startToMidMaxVector[2] + endToMidMaxVector[2]) / 2;

        return {
            arc: {
                start: findClosestPointOnArc(guess, pt1),
                end: findClosestPointOnArc(guess, pt2)
            },
            error: avgDistance
        };
    }

    let div = 10;
    let results = adjustArc(firstGuess, div);
    for (let i = 0; i < 50; i++) {
        console.log(div, results.arc.start, results.arc.end, results.error);
        const newResults = adjustArc(results.arc, div);
        if (newResults.error < results.error) {
            results = newResults;
        } else {
            div += 1;
        }
    }
    return results.arc;
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

export function findClosestPointOnArc(arc: Arc, pt: Point): Point {
    // binary search the arc trying to find the closest point on the arc
    // to pt.
    function recurse(arc: Arc, pt: Point, dLast: number, depth: number): Point {
        const dStart = distance(arc.start, pt);
        if (dStart > dLast - 0.000001 || depth > 100) {
            return arc.start;
        }
        const dEnd = distance(arc.end, pt);
        const dMax = Math.max(dStart, dEnd);
        const mid = midpoint(arc.start, arc.end);
        if (dStart < dEnd) {
            const newArc = {
                start: arc.start,
                end: mid
            };
            return recurse(newArc, pt, dMax, depth + 1);
        } else {
            const newArc = {
                start: mid,
                end: arc.end
            };
            return recurse(newArc, pt, dMax, depth + 1);
        }
    }

    return recurse(arc, pt, EARTH_RADIUS, 0);
}

export interface FilterPointsOptions {
    minDistanceBetweenPoints?: number;
}

export const DEFAULT_FILTER_POINTS_OPTIONS: Required<FilterPointsOptions> = {
    minDistanceBetweenPoints: 5
};

export function geoFilterPoints(points: Point[], options?: FilterPointsOptions): Point[] {
    const reqOptions: Required<FilterPointsOptions> = {...DEFAULT_FILTER_POINTS_OPTIONS, ...options};

    const results: Point[] = [];
    const bestArc = calculateBestArc(points);
    let lastPoint = points[0];
    let lastPointDistanceFromArc = Math.abs(crossTrackDistance(lastPoint, bestArc));
    results.push(points[0]);
    for (let i = 1; i < points.length; i++) {
        const pt = points[i];
        const distanceFromArc = Math.abs(crossTrackDistance(pt, bestArc));
        if (distance(lastPoint, pt) < reqOptions.minDistanceBetweenPoints
            && distanceFromArc < lastPointDistanceFromArc) {
            console.log(`skipped point: ${pt.lat}, ${pt.lon}`);
            continue;
        } else {
            lastPointDistanceFromArc = distanceFromArc;
            lastPoint = pt;
            results.push(pt);
        }
    }
    return results;
}