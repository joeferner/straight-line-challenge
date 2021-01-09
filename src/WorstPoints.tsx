import React from "react";
import {Arc, crossTrackDistance} from "./gpx-helpers";
import {Gpx, GpxPoint} from "./gpx-parser";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {toDmsString} from "./dms";

export interface WorstPointsProps {
    arc: Arc;
    gpx: Gpx;
    numberOfPoints?: number;
    selectedWorstPoint?: GpxPoint;
    onPointClick: (pt: GpxPoint) => void;
}

interface WorstPoint {
    time: string;
    latLon: string;
    error: string;
    errorVal: number;
    gpxPoint: GpxPoint;
}

export function WorstPoints(props: WorstPointsProps) {
    const numberOfPoints = props.numberOfPoints || 100;
    const [points, setPoints] = React.useState<WorstPoint[]>([]);

    React.useEffect(() => {
        let worstDistance = 0;
        let points: WorstPoint[] = [];
        for (const track of props.gpx.tracks) {
            for (const point of track.points) {
                const d = crossTrackDistance(point, props.arc);
                if (d > worstDistance) {
                    points.push({
                        time: point.time.toISOString(),
                        latLon: toDmsString(point.lat, point.lon),
                        error: d.toFixed(1),
                        errorVal: d,
                        gpxPoint: point
                    });
                    points = points.sort((a, b) => {
                        return a.errorVal === b.errorVal ? 0 : (a.errorVal > b.errorVal ? -1 : 1);
                    });
                    points = points.slice(0, numberOfPoints);
                }
            }
        }
        setPoints(points);
    }, [props.arc, props.gpx, numberOfPoints]);

    const handleRowClick = React.useCallback((pt) => {
        props.onPointClick(pt.gpxPoint);
    }, [props.onPointClick]);

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
                    let selected = false;
                    if (props.selectedWorstPoint
                        && props.selectedWorstPoint.lat === pt.gpxPoint.lat
                        && props.selectedWorstPoint.lon === pt.gpxPoint.lon) {
                        selected = true;
                    }
                    return (<WorstPointsTableRow
                        key={pt.time + pt.latLon}
                        pt={pt}
                        selected={selected}
                        onRowClick={handleRowClick}
                    />)
                })}
            </TableBody>
        </Table>
    </TableContainer>);
}

function WorstPointsTableRow(props: { pt: WorstPoint, selected: boolean, onRowClick: (pt: WorstPoint) => void }) {
    return (<TableRow
        onClick={(evt: any) => props.onRowClick(props.pt)}
        selected={props.selected}
        style={{cursor: 'pointer'}}
    >
        <TableCell>{props.pt.time}</TableCell>
        <TableCell>{props.pt.latLon}</TableCell>
        <TableCell>{props.pt.error}m</TableCell>
    </TableRow>);
}