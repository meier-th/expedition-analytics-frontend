import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/model/role';
import { LoginService } from 'src/app/service/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  logout() {
    this.auth.logout().subscribe();
    this.router.navigateByUrl("/login");
  }

  isAnalytic() {
    return this.auth.user.role === Role.ADMIN || this.auth.user.role === Role.ANALYTICS;
  }

  isFeeder() {
    return this.auth.user.role === Role.ADMIN || this.auth.user.role === Role.DATA_FEEDER;
  }

  constructor(public auth: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

}
