import {MapContainer, TileLayer, Polyline} from "react-leaflet";
import {Arc} from "./gpx-helpers";
import React from "react";
import {FitBoundsOptions, LatLngBounds, LatLngExpression, LineUtil, Point} from "leaflet";
import {Gpx, GpxPoint} from "./gpx-parser";

export interface MapProps {
    gpx: Gpx;
    bestArc?: Arc;
    selectedWorstPoint?: GpxPoint;
}

export function Map(props: MapProps) {
    const [bounds, setBounds] = React.useState<LatLngBounds | undefined>(undefined);
    const [trackPositions, setTrackPositions] = React.useState<LatLngExpression[] | undefined>(undefined);
    const [bestArcPositions, setBestArcPositions] = React.useState<LatLngExpression[] | undefined>(undefined);
    const [worstPointPolyPositions, setWorstPointPolyPositions] = React.useState<LatLngExpression[] | undefined>(undefined);

    React.useEffect(() => {
        if (props.bestArc) {
            setBestArcPositions([
                [props.bestArc.start.lat, props.bestArc.start.lon],
                [props.bestArc.end.lat, props.bestArc.end.lon]
            ]);
        } else {
            setBestArcPositions(undefined);
        }
    }, [props.bestArc]);

    React.useEffect(() => {
        let bounds: LatLngBounds | undefined = undefined;
        const positions: LatLngExpression[] = [];
        for (const track of props.gpx.tracks) {
            for (const point of track.points) {
                if (isNaN(point.lat) || isNaN(point.lon)) {
                    continue;
                }
                const pt: [number, number] = [point.lat, point.lon];
                positions.push(pt);
                if (bounds) {
                    bounds.extend(pt);
                } else {
                    bounds = new LatLngBounds(pt, pt);
                }
            }
        }
        setTrackPositions(positions);
        setBounds(bounds);
    }, [props.gpx]);

    React.useEffect(() => {
        if (props.selectedWorstPoint && props.bestArc) {
            const pt = LineUtil.closestPointOnSegment(
                new Point(props.selectedWorstPoint.lon, props.selectedWorstPoint.lat),
                new Point(props.bestArc.start.lon, props.bestArc.start.lat),
                new Point(props.bestArc.end.lon, props.bestArc.end.lat)
            )
            setWorstPointPolyPositions([
                [props.selectedWorstPoint.lat, props.selectedWorstPoint.lon],
                [pt.y, pt.x]
            ])
        } else {
            setWorstPointPolyPositions(undefined);
        }
    }, [props.gpx, props.selectedWorstPoint, props.bestArc]);

    const boundsOptions: FitBoundsOptions = {
        padding: [10, 10]
    };
    if (!bounds) {
        return null;
    }
    return (<MapContainer bounds={bounds} boundsOptions={boundsOptions} style={{width: '100%', height: '100%'}}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {worstPointPolyPositions
            ? (<Polyline pathOptions={{color: 'green'}} positions={worstPointPolyPositions}/>)
            : null}
        {trackPositions ? (<Polyline pathOptions={{color: 'blue'}} positions={trackPositions}/>) : null}
        {bestArcPositions ? (<Polyline pathOptions={{color: 'red'}} positions={bestArcPositions}/>) : null}
    </MapContainer>);
}