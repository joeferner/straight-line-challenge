import {Arc} from "./gpx-helpers";
import React from "react";
import {Grid, makeStyles, TextField} from "@material-ui/core";
import {toDmsString} from "./dms";

export interface ArcDisplayProps {
    arc: Arc | undefined;
}

const useStyles = makeStyles((theme) => ({
    root: {},

    label: {
        display: 'inline-block',
        fontWeight: 'bold',
        width: '35pt'
    },

    value: {
        display: 'inline',
        whiteSpace: 'nowrap'
    }
}));

export function ArcDisplay(props: ArcDisplayProps) {
    const classes = useStyles();
    const start = props.arc ? toDmsString(props.arc.start.lat, props.arc.start.lon) : undefined;
    const end = props.arc ? toDmsString(props.arc.end.lat, props.arc.end.lon) : undefined;

    return (<div className={classes.root}>
        <div>
            <div className={classes.label}>Start</div>
            <div className={classes.value}>{start}</div>
        </div>
        <div>
            <div className={classes.label}>End</div>
            <div className={classes.value}>{end}</div>
        </div>
    </div>);
}