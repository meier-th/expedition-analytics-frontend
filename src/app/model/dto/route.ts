import { City } from "../city";

export class Route {
    id: number;
    from: City;
    to: City;

    getTitle() {
        return this.from.name + " - " + this.to.name;
    }

}