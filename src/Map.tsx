import {MapContainer, TileLayer, Polyline} from "react-leaflet";
import {Arc, findClosestPointOnArc, Point} from "./geo-helpers";
import React from "react";
import {FitBoundsOptions, LatLngBounds, LatLngExpression} from "leaflet";

export interface MapProps {
    points: Point[];
    bestArc?: Arc;
    selectedWorstPoint?: Point;
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
        for (const point of props.points) {
            const pt: [number, number] = [point.lat, point.lon];
            positions.push(pt);
            if (bounds) {
                bounds.extend(pt);
            } else {
                bounds = new LatLngBounds(pt, pt);
            }
        }
        setTrackPositions(positions);
        setBounds(bounds);
    }, [props.points]);

    React.useEffect(() => {
        if (props.selectedWorstPoint && props.bestArc) {
            const pt = findClosestPointOnArc(props.bestArc, props.selectedWorstPoint);
            setWorstPointPolyPositions([
                [props.selectedWorstPoint.lat, props.selectedWorstPoint.lon],
                [pt.lat, pt.lon]
            ])
        } else {
            setWorstPointPolyPositions(undefined);
        }
    }, [props.points, props.selectedWorstPoint, props.bestArc]);

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