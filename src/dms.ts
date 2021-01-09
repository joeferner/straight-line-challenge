const formatcoords = require("formatcoords");

export function toDmsString(lat: number, lon: number): string {
    return formatcoords(lat, lon).format('FFf');
}
