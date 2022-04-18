import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from 'src/app/model/dto/options';

import { Role } from 'src/app/model/role';
import { Route } from 'src/app/model/dto/route';
import { AnalyticService } from 'src/app/service/analytic/analytic.service';
import { LoginService } from 'src/app/service/login/login.service';
import { Query } from 'src/app/model/dto/query';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public loading: boolean;

  parametersControl = new FormGroup({
    ship: new FormControl(''),
    crew: new FormControl(''),
    route: new FormControl(''),
    startDate: new FormControl(''),
    finishDate: new FormControl(''),
    groupBy: new FormControl('')
  });

  public options: Options = {ships: [], routes: [], cities:[], crews: [], timeRange: {start: null, finish: null}};

  public groupBys = ['year', 'ship', 'crew', 'route'];

  constructor(private auth: LoginService, private router: Router, private analyticsService :
    AnalyticService) { }

  ngOnInit(): void {
    this.auth.checkIfSignedIn()
    .subscribe(res => {
      if (res == null) {
        this.router.navigateByUrl('/login');
      } else {
      this.auth.user.username = res.username;
      this.auth.user.role = res.role;
      this.auth.user.loggedIn = true;
      if (this.auth.user.role !== Role.ADMIN && this.auth.user.role !== Role.ANALYTICS) {
        this.router.navigateByUrl('/insertion');
      } else {
        this.refreshOptions();
      }
    }
    }, err => {
      this.router.navigateByUrl('/login');
    });

  }

  refreshOptions() {
    this.loading = true;
    this.analyticsService.getOptions().subscribe(opts => {
      this.options = opts;
      this.loading = false;
    })
  }

  updateAnalytics() {
    if (this.parametersControl.get('groupBy').value == '') {
      this.loadUngrouped();
    } else {
      this.loadGrouped(this.parametersControl.get('groupBy').value);
    }
  }

  loadUngrouped() {
    let query : Query = {ships:[], routes:[], crews:[], timeRange: {start: null, finish: null}};
    query.ships = this.parametersControl.get('ship').value.map(elem => elem.id);
    query.crews = this.parametersControl.get('crew').value.map(elem => elem.id);
    query.routes = this.parametersControl.get('route').value.map(elem => elem.id);
  }

  loadGrouped(group) {

  }

}
