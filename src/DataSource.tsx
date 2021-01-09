import React, {ChangeEvent} from 'react';
import {gpxParse, Gpx} from "./gpx-parser";

export interface DataSourceProps {
    onGpxChange: (gpx: Gpx | undefined) => void;
}

export function DataSource(props: DataSourceProps) {
    const handleFileChange = React.useCallback((args: ChangeEvent<HTMLInputElement>) => {
        if (!args.currentTarget.files) {
            return;
        }
        const fr = new FileReader();
        fr.onload = function () {
            props.onGpxChange(gpxParse(fr.result as string));
        }
        fr.readAsText(args.currentTarget.files[0]);
    }, [props]);

    return (<div>
        <input type="file" onChange={handleFileChange}/>
    </div>)
}