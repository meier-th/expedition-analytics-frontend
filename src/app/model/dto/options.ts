import { City } from "../city";
import { Crew } from "../crew";
import { Ship } from "../ship";
import { Route } from "./route";
import { TimeRange } from "./timerange";

export class Options {
    ships: Ship[];
    crews: Crew[];
    cities: City[];
    routes: Route[];
    timeRange: TimeRange;
}