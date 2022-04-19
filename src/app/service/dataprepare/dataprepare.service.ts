import { Injectable } from '@angular/core';
import { AggregateRange } from 'src/app/model/dto/aggregaterange';
import { Options } from 'src/app/model/dto/options';
import { GroupBy } from 'src/app/model/groupby';

@Injectable({
  providedIn: 'root'
})
export class DataprepareService {

  constructor() { }

  public getLabels(groupBy: GroupBy, groupedAggregate: AggregateRange, options: Options) {
    let labels = [];
    let groupIds = groupedAggregate.data.map(elem => elem.group);
    switch (groupBy) {
      case GroupBy.crew: {
        labels = groupIds.map(id => options.crews.find(cr => cr.id == id))
          .map(crew => crew.name);
        break;
      }
      case GroupBy.route: {
        labels = groupIds.map(id => options.routes.find(route => route.id == id))
          .map(route => route.from.name + ' - ' + route.to.name);
          break;
      }
      case GroupBy.ship: {
        labels = groupIds.map(id => options.ships.find(ship => ship.id == id))
          .map(ship => ship.name);
          break;
      }
      default: {
        labels = groupIds;
      }
    }
    return labels;
  }

  getSums(groupedAggregate: AggregateRange) {
    return groupedAggregate.data.map(aggr => aggr.value.sum);
  }

  getAvgs(groupedAggregate: AggregateRange) {
    return groupedAggregate.data.map(aggr => aggr.value.avg);
  }

  getCounts(groupedAggregate: AggregateRange) {
    return groupedAggregate.data.map(aggr => aggr.value.count);
  }

}
