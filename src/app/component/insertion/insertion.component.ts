import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login/login.service';

@Component({
  selector: 'app-insertion',
  templateUrl: './insertion.component.html',
  styleUrls: ['./insertion.component.scss']
})
export class InsertionComponent implements OnInit {

  constructor(private auth: LoginService, private router: Router) { }

  ngOnInit(): void {
    if (this.auth.user == undefined || !this.auth.user.loggedIn) {
      this.router.navigateByUrl('/login');
    }
  }

}
