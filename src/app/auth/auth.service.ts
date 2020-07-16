import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
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

  loginUser(email: string, password: string) {
    const userData: Auth = {
      email: email,
      password: password
    }
    const url = `${this.baseUrl}/api/user/login`;
    this.http.post<{message:string,token:string}>(url, userData).subscribe(
      response => {
        const token=response.token;
        this.token=token;
      })
  }

  getToken(){
    return this.token;
  }

}
