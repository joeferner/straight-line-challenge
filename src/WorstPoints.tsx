import React from "react";
import {Arc, calculateDistanceFromArc} from "./gpx-helpers";
import {Gpx} from "./gpx-parser";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {toDmsString} from "./dms";

export interface WorstPointsProps {
    arc: Arc;
    gpx: Gpx;
    numberOfPoints?: number;
}

interface WorstPoint {
    time: string;
    latLon: string;
    error: string;
}

export function WorstPoints(props: WorstPointsProps) {
    const numberOfPoints = props.numberOfPoints || 100;
    const [points, setPoints] = React.useState<WorstPoint[]>([]);

    React.useEffect(() => {
        let worstDistance = 0;
        let points: WorstPoint[] = [];
        for (const track of props.gpx.tracks) {
            for (const point of track.points) {
                const d = calculateDistanceFromArc(point, props.arc);
                if (d > worstDistance) {
                    points.push({
                        time: point.time.toISOString(),
                        latLon: toDmsString(point.lat, point.lon),
                        error: d.toFixed(1)
                    });
                    points = points.sort((a, b) => {
                        return a.error === b.error ? 0 : (a.error > b.error ? -1 : 1);
                    });
                    points = points.slice(0, numberOfPoints);
                }
            }
        }
        setPoints(points);
    }, [props.arc, props.gpx, numberOfPoints]);

    return (<TableContainer component={Paper} style={{flexGrow: 1, display: 'flex'}}>
        <Table stickyHeader={true}>
            <TableHead>
                <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Lat/Lon</TableCell>
                    <TableCell>Error</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {points.map((pt) => {
                    return (<TableRow key={pt.time + pt.latLon}>
                        <TableCell>{pt.time}</TableCell>
                        <TableCell>{pt.latLon}</TableCell>
                        <TableCell>{pt.error}m</TableCell>
                    </TableRow>);
                })}
            </TableBody>
        </Table>
    </TableContainer>);
}
