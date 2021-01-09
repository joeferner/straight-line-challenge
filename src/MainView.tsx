import React from "react";
import {Gpx, GpxPoint} from "./gpx-parser";
import {Arc, calculateBestArc} from "./gpx-helpers";
import {ArcDisplay} from "./ArcDisplay";
import {Typography} from "@material-ui/core";
import {WorstPoints} from "./WorstPoints";
import {Map} from "./Map";

export interface MainViewProps {
    gpx: Gpx;
}

export function MainView(props: MainViewProps) {
    const [bestArc, setBestArc] = React.useState<Arc | undefined>(undefined);
    const [selectedWorstPoint, setSelectedWorstPoint] = React.useState<GpxPoint | undefined>(undefined);

    React.useEffect(() => {
        setBestArc(calculateBestArc(props.gpx));
    }, [props.gpx]);

    const handleWorstPointClick = React.useCallback((pt) => {
        setSelectedWorstPoint(pt);
    }, [setSelectedWorstPoint]);

    const worstPointsArc = bestArc;
    return (<div style={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <div>
            <Typography variant="h6">Best Arc</Typography>
            <ArcDisplay arc={bestArc}/>
        </div>
        <div style={{display: 'flex', flexGrow: 1, overflow: 'hidden'}}>
            <div style={{display: 'flex', flexDirection: 'column', flex: '50%'}}>
                <Typography variant="h6">Worst Points</Typography>
                {worstPointsArc ? (<WorstPoints
                    arc={worstPointsArc}
                    gpx={props.gpx}
                    selectedWorstPoint={selectedWorstPoint}
                    onPointClick={handleWorstPointClick}/>) : null}
            </div>
            <div style={{flex: '50%'}}>
                <Typography variant="h6">Map</Typography>
                <Map gpx={props.gpx} bestArc={bestArc} selectedWorstPoint={selectedWorstPoint}/>
            </div>
        </div>
    </div>);
}