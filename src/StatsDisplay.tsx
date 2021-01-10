import {Stats} from "./geo-helpers";

export interface StatsDisplayProps {
    stats: Stats
}

export function StatsDisplay(props: StatsDisplayProps) {
    return (<div style={{display: 'flex', flexDirection: 'column'}}>
        <Stat label="Min" value={props.stats.min} units="m"/>
        <Stat label="Max" value={props.stats.max} units="m"/>
        <Stat label="Mean" value={props.stats.mean} units="m"/>
        <Stat label="Sum" value={props.stats.sum} units="m"/>
        <Stat label="StdDev" value={props.stats.stdDeviation}/>
        <Stat label="Distance" value={props.stats.distance} units="m"/>
        <Stat label="Sum/Distance" value={props.stats.sum / props.stats.distance} units="m"/>
    </div>)
}

function Stat(props: { label: string, value: number, units?: string }) {
    return (<div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '100pt'}}>{props.label}</div>
        <div>{(props.value || 0).toFixed(2)}{props.units || ''}</div>
    </div>)
}
