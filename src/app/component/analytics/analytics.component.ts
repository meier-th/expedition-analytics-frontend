import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Options } from 'src/app/model/dto/options';

import { Role } from 'src/app/model/role';
import { AnalyticService } from 'src/app/service/analytic/analytic.service';
import { LoginService } from 'src/app/service/login/login.service';
import { Query } from 'src/app/model/dto/query';
import { TimeRange } from 'src/app/model/dto/timerange';
import { Aggregate } from 'src/app/model/dto/aggregate';
import { GroupedRequestDto } from 'src/app/model/dto/groupedrequest';
import { GroupBy } from 'src/app/model/groupby';
import { AggregateRange } from 'src/app/model/dto/aggregaterange';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DataprepareService } from 'src/app/service/dataprepare/dataprepare.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public loading: boolean;
  public aggregate: Aggregate;
  public groupedAggregate: AggregateRange;
  public showFull: boolean = false;

  private sumChart : Chart;
  private avgChart : Chart;
  private countChart : Chart;

  parametersControl = new FormGroup({
    ship: new FormControl(''),
    crew: new FormControl(''),
    route: new FormControl(''),
    startDate: new FormControl(''),
    finishDate: new FormControl(''),
    groupBy: new FormControl('')
  });

  public options: Options = { ships: [], routes: [], cities: [], crews: [], timeRange: { start: null, finish: null } };

  public groupBys = ['year', 'ship', 'crew', 'route'];

  constructor(private auth: LoginService, private router: Router, private analyticsService:
    AnalyticService, private datePipe: DatePipe, private dataPrepare: DataprepareService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.hideCharts();
    this.initCharts();
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
    let query: Query = { ships: [], routes: [], crews: [], timeRange: { start: null, finish: null } };

    if (this.parametersControl.get('ship').value != null && this.parametersControl.get('ship').value != '') {
      query.ships = this.parametersControl.get('ship').value.map(elem => elem.id);
    }
    if (this.parametersControl.get('crew').value != null && this.parametersControl.get('crew').value != '') {
      query.crews = this.parametersControl.get('crew').value.map(elem => elem.id);
    }
    if (this.parametersControl.get('route').value != null && this.parametersControl.get('route').value != '') {
      query.routes = this.parametersControl.get('route').value.map(elem => elem.id);
    }

    let interval: TimeRange = { start: null, finish: null }

    if (this.parametersControl.get('startDate').value != '') {
      interval.start = this.datePipe.transform(this.parametersControl.get('startDate').value, 'dd-MM-yyyy');
    }
    if (this.parametersControl.get('finishDate').value != '') {
      interval.finish = this.datePipe.transform(this.parametersControl.get('finishDate').value, 'dd-MM-yyyy');
    }
    query.timeRange = interval;

    this.analyticsService.getFull(query).subscribe(res => {
      this.aggregate = res;
      this.hideCharts();
      this.showFull = true;
    });

  }

  loadGrouped(group) {
    let query: Query = { ships: [], routes: [], crews: [], timeRange: { start: null, finish: null } };
    let groupBy: GroupBy;

    if (group == 'ship') {
      groupBy = GroupBy.ship;
    } else if (group == 'crew') {
      groupBy = GroupBy.crew;
    } else if (group == 'year') {
      groupBy = GroupBy.year;
    } else {
      groupBy = GroupBy.route;
    }

    let groupedQuery: GroupedRequestDto = { query, groupBy };

    if (this.parametersControl.get('ship').value != null && this.parametersControl.get('ship').value != '') {
      query.ships = this.parametersControl.get('ship').value.map(elem => elem.id);
    }
    if (this.parametersControl.get('crew').value != null && this.parametersControl.get('crew').value != '') {
      query.crews = this.parametersControl.get('crew').value.map(elem => elem.id);
    }
    if (this.parametersControl.get('route').value != null && this.parametersControl.get('route').value != '') {
      query.routes = this.parametersControl.get('route').value.map(elem => elem.id);
    }

    let interval: TimeRange = { start: null, finish: null }

    if (this.parametersControl.get('startDate').value != null && this.parametersControl.get('startDate').value != '') {
      interval.start = this.datePipe.transform(this.parametersControl.get('startDate').value, 'dd-MM-yyyy');
    }
    if (this.parametersControl.get('finishDate').value != null && this.parametersControl.get('finishDate').value != '') {
      interval.finish = this.datePipe.transform(this.parametersControl.get('finishDate').value, 'dd-MM-yyyy');
    }

    query.timeRange = interval;

    this.analyticsService.getGrouped(groupedQuery).subscribe(res => {
      this.groupedAggregate = res;
      this.showFull = false;
      this.displayCharts();
      this.updateCharts(groupedQuery.groupBy);
    });

  }

  hideCharts() {
    document.getElementById("charts").style.display = "none";
  }

  displayCharts() {
    document.getElementById("charts").style.display = "block";
  }

  initCharts() {
    const sumElem = <HTMLCanvasElement>document.getElementById('sumChart');
    const avgElem = <HTMLCanvasElement>document.getElementById('averageChart');
    const countElem = <HTMLCanvasElement>document.getElementById('countChart');
    const sumCtx = sumElem.getContext('2d');
    const avgCtx = avgElem.getContext('2d');
    const countCtx = countElem.getContext('2d');

    this.sumChart = new Chart(sumCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Profit sum',
          data: [],
          backgroundColor: [
            'rgba(55, 255, 136, 0.3)'
          ],
          borderColor: [
            'rgba(0, 225, 90, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.avgChart = new Chart(avgCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Profit average',
          data: [],
          backgroundColor: [
            'rgba(255, 209, 80, 0.3)'
          ],
          borderColor: [
            'rgba(206, 151, 0, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    this.countChart = new Chart(countCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Number of expeditions',
          data: [],
          backgroundColor: [
            'rgba(68, 156, 255, 0.3)'
          ],
          borderColor: [
            'rgba(0, 94, 201, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateCharts(groupBy : GroupBy) {
    let labels = this.dataPrepare.getLabels(groupBy, this.groupedAggregate, this.options);
    let sumData = this.dataPrepare.getSums(this.groupedAggregate);
    let avgData = this.dataPrepare.getAvgs(this.groupedAggregate);
    let countData = this.dataPrepare.getCounts(this.groupedAggregate);
    this.sumChart.data.labels = labels;
    this.avgChart.data.labels = labels;
    this.countChart.data.labels = labels;

    this.sumChart.data.datasets[0].data = sumData;
    this.avgChart.data.datasets[0].data = avgData;
    this.countChart.data.datasets[0].data = countData;
    
    this.sumChart.update();
    this.avgChart.update();
    this.countChart.update();
  }

}
