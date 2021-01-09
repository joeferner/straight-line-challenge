const gpxParser = require("../node_modules/gpxparser/src/GPXParser");

export interface GpxMetadata {
    name: string;
    desc: string;
    link: GpxLink;
    author: GpxAuthor;
    time: Date;
}

export interface GpxAuthor {
    name: string;
    email: GpxEmail;
    link: GpxLink;
}

export interface GpxEmail {
    id: string;
    domain: string;
}

export interface GpxLink {
    href: string;
    text: string;
    type: string;
}

export interface GpxWaypoint {
    name: string;
    cmt: string;
    desc: string;
    lat: number;
    lon: number;
    ele: number;
    time: Date;
}

export interface GpxTrack {
    name: string;
    cmt: string;
    desc: string;
    src: string;
    number: string;
    link: string;
    type: string;
    points: GpxPoint[];
    distance: GpxDistance;
    elevation: GpxElevation;
    slopes: number[];
}

export interface GpxRoute {
    name: string;
    cmt: string;
    desc: string;
    src: string;
    number: string;
    link: string;
    type: string;
    points: GpxPoint[];
    distance: GpxDistance;
    elevation: GpxElevation;
    slopes: number[];
}

export interface GpxPoint {
    lat: number;
    lon: number;
    ele: number;
    time: Date;
}

export interface GpxDistance {
    total: number;
    cumul: number;
}

export interface GpxElevation {
    max: number;
    min: number;
    pos: number;
    neg: number;
    avg: number;
}

export interface Gpx {
    xmlSource: Document;
    metadata: GpxMetadata;
    waypoints: GpxWaypoint[];
    tracks: GpxTrack[];
    routes: GpxRoute[];
}

export function gpxParse(str: string): Gpx | undefined {
    const parser = new gpxParser();
    parser.parse(str);
    return parser as Gpx;
}