import { City } from "./city";
import { Crew } from "./crew";
import { Interval } from "./interval";
import { Ship } from "./ship";

export class Expedition {
    id?: number;
    startCity: City;
    finishCity: City;
    ship: Ship;
    crew: Crew;
    interval: Interval;
    profit: number;
}