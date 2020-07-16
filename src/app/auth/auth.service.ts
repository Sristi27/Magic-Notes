import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  baseUrl = "http://localhost:3000";

  createUser(email:string,password:string){
    
    const url = `${this.baseUrl}/api/user/signup`;
    this.http.post()
  }
}
