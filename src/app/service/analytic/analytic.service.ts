import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { Aggregate } from 'src/app/model/dto/aggregate';
import { AggregateRange } from 'src/app/model/dto/aggregaterange';
import { GroupedRequestDto } from 'src/app/model/dto/groupedrequest';
import { Options } from 'src/app/model/dto/options';
import { serverAddress } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getOptions() {
    return this.http.get<Options>(serverAddress+'analytics/options', this.httpOptions);
  }

  getFull(query: Query) {
    return this.http.post<Aggregate>(serverAddress+'analytics/full', query, this.httpOptions);
  }

  getGrouped(query: GroupedRequestDto) {
    return this.http.post<AggregateRange>(serverAddress+'analytics/grouped', query, this.httpOptions);
  }

}
