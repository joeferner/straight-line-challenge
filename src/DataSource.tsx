import React, {ChangeEvent} from 'react';
import {gpxParse, gpxFilterPoints} from "./gpx-parser";
import {Point} from "./geo-helpers";

export interface DataSourceProps {
    onChange: (points: Point[]) => void;
}

export function DataSource(props: DataSourceProps) {
    const handleFileChange = React.useCallback((args: ChangeEvent<HTMLInputElement>) => {
        if (!args.currentTarget.files) {
            return;
        }
        const fr = new FileReader();
        fr.onload = function () {
            props.onChange(gpxFilterPoints(gpxParse(fr.result as string)));
        }
        fr.readAsText(args.currentTarget.files[0]);
    }, [props]);

    return (<div style={{width: '150pt', margin: 'auto'}}>
        Select a GPX file to analyze
        <br/>
        <input type="file" onChange={handleFileChange}/>
    </div>)
}