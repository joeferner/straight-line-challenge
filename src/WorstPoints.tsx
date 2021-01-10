import React from "react";
import {Arc, crossTrackDistance, Point} from "./geo-helpers";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {toDmsString} from "./dms";

export interface WorstPointsProps {
    arc: Arc;
    points: Point[];
    numberOfPoints?: number;
    selectedWorstPoint?: Point;
    onPointClick: (pt: Point) => void;
}

interface WorstPoint {
    time: string;
    latLon: string;
    error: string;
    errorVal: number;
    point: Point;
}

export function WorstPoints(props: WorstPointsProps) {
    const numberOfPoints = props.numberOfPoints || 100;
    const [points, setPoints] = React.useState<WorstPoint[]>([]);

    React.useEffect(() => {
        let worstDistance = 0;
        let points: WorstPoint[] = [];
        for (const point of props.points) {
            const d = Math.abs(crossTrackDistance(point, props.arc));
            if (d > worstDistance) {
                points.push({
                    time: point.time?.toISOString() || 'unknown',
                    latLon: toDmsString(point.lat, point.lon),
                    error: d.toFixed(1),
                    errorVal: d,
                    point: point
                });
                points = points.sort((a, b) => {
                    return a.errorVal === b.errorVal ? 0 : (a.errorVal > b.errorVal ? -1 : 1);
                });
                points = points.slice(0, numberOfPoints);
            }
        }
        setPoints(points);
    }, [props.arc, props.points, numberOfPoints]);

    const handleRowClick = React.useCallback((pt: WorstPoint) => {
        props.onPointClick(pt.point);
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
                        && props.selectedWorstPoint.lat === pt.point.lat
                        && props.selectedWorstPoint.lon === pt.point.lon) {
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