import React from "react";
import {Gpx} from "./gpx-parser";
import {Arc, calculateBestArc} from "./gpx-helpers";
import {ArcDisplay} from "./ArcDisplay";
import {Grid, Typography} from "@material-ui/core";
import {WorstPoints} from "./WorstPoints";

export interface MainViewProps {
    gpx: Gpx;
}

export function MainView(props: MainViewProps) {
    const [bestArc, setBestArc] = React.useState<Arc | undefined>(undefined);

    React.useEffect(() => {
        setBestArc(calculateBestArc(props.gpx));
    }, [props.gpx]);

    const worstPointsArc = bestArc;
    return (<Grid container>
        <Grid item xs={12}>
            <Typography variant="h6">Best Arc</Typography>
            <ArcDisplay arc={bestArc}/>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h6">Worst Points</Typography>
            {worstPointsArc ? (<WorstPoints arc={worstPointsArc} gpx={props.gpx}/>) : null}
        </Grid>
        <Grid item xs={6}>
            Map
        </Grid>
    </Grid>);
}