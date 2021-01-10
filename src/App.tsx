import React from 'react';
import {DataSource} from "./DataSource";
import {MainView} from "./MainView";
import {Point} from "./geo-helpers";

function App() {
    const [points, setPoints] = React.useState<Point[] | undefined>(undefined);

    const handleDataChange = React.useCallback((points: Point[]) => {
        setPoints(points);
    }, [setPoints]);

    return points
        ? (<MainView points={points}/>)
        : (<DataSource onChange={handleDataChange}/>);
}

export default App;
