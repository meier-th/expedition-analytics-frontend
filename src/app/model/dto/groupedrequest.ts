import { GroupBy } from "../groupby";
import { Query } from "./query";

export class GroupedRequestDto {
    query: Query;
    groupBy: GroupBy;
}