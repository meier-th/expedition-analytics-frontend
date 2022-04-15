import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { City } from 'src/app/model/city';
import { Crew } from 'src/app/model/crew';
import { Options } from 'src/app/model/dto/options';
import { Expedition } from 'src/app/model/expedition';
import { Interval } from 'src/app/model/interval';
import { Ship } from 'src/app/model/ship';
import { serverAddress } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsertionService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getOptions() {
    return this.http.get<Options>(serverAddress+'insertion/options', this.httpOptions);
  }

  insertCity(city: City) {
    return this.http.post(serverAddress+'insertion/city', city, this.httpOptions);
  }

  insertShip(ship: Ship) {
    return this.http.post(serverAddress+'insertion/ship', ship, this.httpOptions);
  }

  insertCrew(crew: Crew) {
    return this.http.post(serverAddress+'insertion/crew', crew, this.httpOptions);
  }

  insertExpedition(expedition: Expedition) {
    return this.http.post(serverAddress+'insertion/expedition', expedition, this.httpOptions);
  }

  insertInterval(interval: Interval) {
    return this.http.post(serverAddress+'insertion/interval', interval, this.httpOptions);
  }

}
