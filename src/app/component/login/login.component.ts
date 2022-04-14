import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/model/role';
import { LoginService } from 'src/app/service/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginControl = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private auth: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.loginControl.value.username, this.loginControl.value.password)
    .subscribe(user => {
      this.auth.user.username = user.username;
      this.auth.user.loggedIn = true;
      this.auth.user.role = user.role;
      if (this.auth.user.role === Role.ADMIN || this.auth.user.role === Role.ANALYTICS) {
        this.router.navigateByUrl('/analytics');
      } else {
        this.router.navigateByUrl('/insertion');
      }
    });
  }

}
