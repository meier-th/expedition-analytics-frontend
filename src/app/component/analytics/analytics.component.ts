import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/model/role';
import { AnalyticService } from 'src/app/service/analytic/analytic.service';
import { LoginService } from 'src/app/service/login/login.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  constructor(private auth: LoginService, private router: Router, private analyticsService :
    AnalyticService) { }

  ngOnInit(): void {
    if (this.auth.user == undefined || !this.auth.user.loggedIn) {
      this.router.navigateByUrl('/login');
    }
    else {
      if (this.auth.user.role !== Role.ADMIN && this.auth.user.role !== Role.ANALYTICS) {
        this.router.navigateByUrl('/insertion');
      }
    }
  }

}
