import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Options } from 'src/app/model/dto/options';
import { Expedition } from 'src/app/model/expedition';
import { Role } from 'src/app/model/role';
import { InsertionService } from 'src/app/service/insertion/insertion.service';
import { LoginService } from 'src/app/service/login/login.service';
import { City } from 'src/app/model/city';
import { Ship } from 'src/app/model/ship';
import { Crew } from 'src/app/model/crew';

@Component({
  selector: 'app-insertion',
  templateUrl: './insertion.component.html',
  styleUrls: ['./insertion.component.scss']
})
export class InsertionComponent implements OnInit {

  public options: Options = {ships: [], routes: [], cities:[], crews: [], timeRange: {start: null, finish: null}};
  public loading: boolean;

  private exepeditionPrefix = 'expedition';
  private shipPrefix = 'ship';
  private cityPrefix = 'city';
  private crewPrefix = 'crew';

  expeditionControl = new FormGroup({
    ship: new FormControl(''),
    crew: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    profit: new FormControl(''),
    startCity: new FormControl(''),
    finishCity: new FormControl(''),
  });

  shipControl = new FormGroup({
    name: new FormControl(''),
    speed: new FormControl(''),
    fuelConsumption: new FormControl(''),
  });

  crewControl = new FormGroup({
    name: new FormControl(''),
  });

  cityControl = new FormGroup({
    name: new FormControl(''),
    longitude: new FormControl(''),
    latitude: new FormControl(''),
  });

  constructor(private auth: LoginService, private router: Router, private insertionService :
    InsertionService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.refreshOptions();
    this.auth.checkIfSignedIn()
    .subscribe(res => {
      if (res == null) {
        this.router.navigateByUrl('/login');
      }
      this.auth.user.username = res.username;
      this.auth.user.role = res.role;
      this.auth.user.loggedIn = true;
      if (this.auth.user.role === Role.ANALYTICS) {
        this.router.navigateByUrl('/analytics');
      }
    }, err => {
      this.router.navigateByUrl('/login');
    })
  }

  insertExpedition() {
    if (this.validateExpedition()) {
      let expedition = new Expedition();

      let startDate : Date = this.expeditionControl.get('startDate').value;
      let endDate : Date = this.expeditionControl.get('endDate').value;
      let startCity = this.expeditionControl.get('startCity').value;
      let finishCity = this.expeditionControl.get('finishCity').value;
      let profit = this.expeditionControl.get('profit').value;
      let ship = this.expeditionControl.get('ship').value;
      let crew = this.expeditionControl.get('crew').value;

      console.log("start city: "+startCity);
      console.log("finish city: "+finishCity);
      console.log("crew "+crew);
      console.log("ship: "+ship);
      
      
      if (profit == '' || ship == '' || crew == '') {
        this.showError(this.exepeditionPrefix);
        return;
      }

      expedition.profit = profit;
      expedition.interval = {startDate: this.datePipe.transform(startDate, 'dd-MM-yyyy'), finishDate: this.datePipe.transform(endDate, 'dd-MM-yyyy') };
      this.options.cities.forEach(city => {
        console.log("city id: "+city.id);
        if (city.id == startCity) {
          expedition.startCity = city;
        }
        if (city.id == finishCity) {
          expedition.finishCity = city;
        }
      });
      this.options.ships.forEach(shp => {
        if (shp.id == ship) {
          expedition.ship = shp;
        }
      });
      this.options.crews.forEach(crw => {
        if (crw.id == crew) {
          expedition.crew = crw;
        }
      });
      console.log(expedition);

      this.insertionService.insertExpedition(expedition).pipe(catchError(err => {
        this.showError(this.exepeditionPrefix);
        return null;
      })).subscribe(res => {
        this.expeditionControl.reset();
      });
    } else {
      this.showError(this.exepeditionPrefix);
    }
  }

  insertCity() {
    let city = new City();

    let name = this.cityControl.get('name').value;
    let longitude = this.cityControl.get('longitude').value;
    let latitude = this.cityControl.get('latitude').value;

    if (name == '' || longitude == '' || latitude == '') {
      this.showError(this.cityPrefix);
      return;
    }

    city.latitude = latitude;
    city.longitude = longitude;
    city.name = name;

    this.insertionService.insertCity(city).pipe(catchError(err => {
      this.showError(this.cityPrefix);
      return null;
    })).subscribe(res => {
      this.cityControl.reset();
      this.refreshOptions();
    });
  }

  insertShip() {
    let ship = new Ship();

    let name = this.shipControl.get('name').value;
    let speed = this.shipControl.get('speed').value;
    let fuelConsumption = this.shipControl.get('fuelConsumption').value;
  
    if (name == '' || speed == '' || fuelConsumption == '') {
      this.showError(this.shipPrefix);
      return;
    }

    ship.name = name;
    ship.speed = speed;
    ship.fuelConsumption = fuelConsumption;

    this.insertionService.insertShip(ship).pipe(catchError(err => {
      this.showError(this.shipPrefix);
      return null;
    })).subscribe(res => {
      this.shipControl.reset();
      this.refreshOptions();
    });
  }

  insertCrew() {
    let crew = new Crew();

    let name = this.crewControl.get('name').value;
    if (name == '') {
      this.showError(this.crewPrefix);
      return;
    }
    crew.name = name;

    this.insertionService.insertCrew(crew).pipe(catchError(err => {
      this.showError(this.crewPrefix);
      return null;
    })).subscribe(res => {
      this.crewControl.reset();
      this.refreshOptions();
    });
  }

  validateExpedition() {
    let startDate : Date = this.expeditionControl.get('startDate').value;
    let endDate : Date = this.expeditionControl.get('endDate').value;

    let startCity = this.expeditionControl.get('startCity').value;
    let finishCity = this.expeditionControl.get('finishCity').value;

    return endDate != null && startDate != null && startCity != '' && finishCity != '' && endDate > startDate && startCity !== finishCity;
  }

  refreshOptions() {
    this.loading = true;
    this.insertionService.getOptions().subscribe(opts => {
      this.options = opts;
      this.expeditionControl.reset();
      this.loading = false;
    })
  }

  showError(form: string) {
    document.getElementById(form+'Alert').style.display = 'block';
  }

}
