import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService:AuthService) { }

  ngOnInit(): void {
  }
  onLogin(f:NgForm){
    this.authService.loginUSer(f.value.email,f.value.password);
  }

}
