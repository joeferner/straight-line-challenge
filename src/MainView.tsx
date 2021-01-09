import React from "react";
import {Gpx} from "./gpx-parser";
import {Arc, calculateBestArc} from "./gpx-helpers";
import {ArcDisplay} from "./ArcDisplay";
import {Typography} from "@material-ui/core";

export interface MainViewProps {
    gpx: Gpx;
}

export function MainView(props: MainViewProps) {
    const [bestArc, setBestArc] = React.useState<Arc | undefined>(undefined);

    React.useEffect(() => {
        setBestArc(calculateBestArc(props.gpx));
    }, [props.gpx]);

    return (<div>
        <div>
            <Typography variant="h6">Best Arc</Typography>
            <ArcDisplay arc={bestArc}/>
        </div>
    </div>);
}