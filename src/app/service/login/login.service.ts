import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { serverAddress } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { catchError, mergeMap } from 'rxjs';
import { UserDto } from 'src/app/model/dto/user-dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user : User;

  constructor(private http: HttpClient) {
    this.user = {username: '', role: null, loggedIn: false};
   }

  login(username: string, password: string) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      withCredentials: true
    };

    const parameters = new HttpParams()
        .append('username', username)
        .append('password', password);
    
    return this.http.post(serverAddress+'login', parameters, httpOptions)
      .pipe(
        mergeMap((res: Response) => {
          return this.http.get<UserDto>(serverAddress+'me', {withCredentials: true});
        })
      );
  }

  logout() {
    this.user.loggedIn = false;
    return this.http.get(serverAddress+'logout', {withCredentials: true});
  }

  signUp(username: string, password: string, role: Role) {
    const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
    return this.http.post(serverAddress+'registration', JSON.stringify({username, password, role}), {headers: headers})
    .pipe(
      mergeMap((res: Response) => {
        return this.login(username, password); 
      }
    )
    );
  }

  checkIfSignedIn(){
    return this.http.get(serverAddress+'me',
    {
      withCredentials: true,
      responseType: 'text'
    });
  }

}
