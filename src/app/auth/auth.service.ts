import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseUrl = "http://localhost:3000";

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

  loginUSer(email: string, password: string) {
    const userData: Auth = {
      email: email,
      password: password
    }
    const url = `${this.baseUrl}/api/user/login`;
    this.http.post(url, userData).subscribe(
      response => {
        console.log(response)
      })
  }
}
