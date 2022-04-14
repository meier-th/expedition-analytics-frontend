import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerControl = new FormGroup({
    username: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });

  constructor(private auth: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  showError(errorMsg: string) {
    const errorLabel = document.getElementById('error-label');
    errorLabel.innerHTML = errorMsg;
    document.getElementById('error-label').classList.add('active');
  }

  signup() {
    const username = this.registerControl.value.username;
    const password = this.registerControl.value.password;
    const role = this.registerControl.value.role;
    const repeatPassword = this.registerControl.value.repeatPassword;
    if (password === repeatPassword) {
      this.auth.signUp(username, password, role).subscribe(user => {
        this.auth.user.loggedIn = true;
        this.auth.user.role = user.role;
        this.auth.user.username = user.username;
        if (role === 'ADMIN' || role === 'ANALYTIC') {
          this.router.navigateByUrl('/analytics');
        } else {
          this.router.navigateByUrl('/insertion');
        }
      }, error => {
        this.showError('Username is already occuied!');
      });
    } else {
      this.showError('Passwords do not match!');
    }
  }

}
