import React from 'react';
import {DataSource} from "./DataSource";
import {Gpx} from "./gpx-parser";
import {MainView} from "./MainView";

function App() {
    const [gpx, setGpx] = React.useState<Gpx | undefined>(undefined);

    const handleGpxChange = React.useCallback((gpx: Gpx | undefined) => {
        setGpx(gpx);
    }, [setGpx]);

    return (<div className="App">
        {gpx
            ? (<MainView gpx={gpx}/>)
            : (<DataSource onGpxChange={handleGpxChange}/>)
        }
    </div>);
}

export default App;
