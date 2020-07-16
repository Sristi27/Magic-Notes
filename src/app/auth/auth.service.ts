import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Node } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string; 
  private tokenTimer;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  baseUrl = "http://localhost:3000";

  getAuthStatus() {
    return this.authStatusListener.asObservable();  //camt emit but listen from other comoponents
    //can emit only in this component only
  }

  isAuth() {
    return this.isAuthenticated;

  }

  createUser(email: string, password: string) {

    const userData: Auth = {
      email: email,
      password: password
    }
    const url = `${this.baseUrl}/api/user/signup`;
    this.http.post(url, userData).subscribe(
      response => {
        console.log(response)
      })
  }

  loginUser(email: string, password: string) {
    const userData: Auth = {
      email: email,
      password: password
    }
    const url = `${this.baseUrl}/api/user/login`;
    this.http.post<{ message: string, token: string, expiresIn: number }>(url, userData).subscribe(
      response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresIn = response.expiresIn;
          this.tokenTimer=setTimeout(() => {
            this.logoutUser();
          }, expiresIn * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(["/"]);
        }
      })
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
  }

  getToken() {
    return this.token;
  }

}
