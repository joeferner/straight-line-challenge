import React from "react";
import {Arc, calculateBestArc, calculateStats, Point, Stats} from "./geo-helpers";
import {ArcDisplay} from "./ArcDisplay";
import {Typography} from "@material-ui/core";
import {WorstPoints} from "./WorstPoints";
import {Map} from "./Map";
import {StatsDisplay} from "./StatsDisplay";

export interface MainViewProps {
    points: Point[];
}

export function MainView(props: MainViewProps) {
    const [bestArc, setBestArc] = React.useState<Arc | undefined>(undefined);
    const [stats, setStats] = React.useState<Stats | undefined>(undefined);
    const [selectedWorstPoint, setSelectedWorstPoint] = React.useState<Point | undefined>(undefined);

    React.useEffect(() => {
        const bestArc = calculateBestArc(props.points);
        setBestArc(bestArc);
        setStats(calculateStats(props.points, bestArc));
    }, [props.points]);

    const handleWorstPointClick = React.useCallback((pt) => {
        setSelectedWorstPoint(pt);
    }, [setSelectedWorstPoint]);

    const worstPointsArc = bestArc;
    return (<div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{marginRight: '10pt'}}>
                <Typography variant="h6">Best Arc</Typography>
                <ArcDisplay arc={bestArc}/>
            </div>
            <div>
                <Typography variant="h6">Stats</Typography>
                {stats ? (<StatsDisplay stats={stats}/>) : null}
            </div>
        </div>
        <div style={{display: 'flex', flexGrow: 1, overflow: 'hidden'}}>
            <div style={{display: 'flex', flexDirection: 'column', flex: '50%'}}>
                <Typography variant="h6">Worst Points</Typography>
                {worstPointsArc ? (<WorstPoints
                    arc={worstPointsArc}
                    points={props.points}
                    selectedWorstPoint={selectedWorstPoint}
                    onPointClick={handleWorstPointClick}/>) : null}
            </div>
            <div style={{flex: '50%'}}>
                <Typography variant="h6">Map</Typography>
                <Map points={props.points} bestArc={bestArc} selectedWorstPoint={selectedWorstPoint}/>
            </div>
        </div>
    </div>);
}