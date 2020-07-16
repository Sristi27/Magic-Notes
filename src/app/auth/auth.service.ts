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
  private userId:string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  baseUrl = "http://localhost:3000";

  private saveAuthData(token: string, expirationDate: Date,userId:string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId',userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId')

  }

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
    this.http.post<{ message: string, token: string, expiresIn: number,userId:string}>(url, userData).subscribe(
      response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresIn = response.expiresIn;
          this.userId=response.userId;
          this.tokenTimer = setTimeout(() => {
            this.logoutUser();
          }, expiresIn * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate,this.userId);
          this.router.navigate(["/"]);
        }
      })
  }
  getUserId(){
return this.userId; 
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId=null;
  }

  autoAuthUser() {

    const info = this.getAuthData();
    //check the expiry date to see if is valid
    if(!info) return;
    const now = new Date();
    const expiresin = info.expiration.getTime() - now.getTime();
    if (expiresin>0) { //future date
      this.token = info.token;
      this.userId=info.userId;
      this.isAuthenticated = true;
      this.tokenTimer = setTimeout(() => {
        this.logoutUser();
      }, expiresin);
      this.authStatusListener.next(true);
    }
    
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId=localStorage.getItem('userId')
    if (!token || !expiration)
      return;
    return {
      token: token,
      expiration: new Date(expiration),
      userId:userId
    }

  }

  getToken() {
    return this.token;
  }

}
