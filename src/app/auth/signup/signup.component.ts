import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading=false;
  constructor(public authService:AuthService) { }

  ngOnInit(): void {
  }
  onSignUp(f:NgForm){
   this.authService.createUser(f.value.email,f.value.password);
   this.isLoading=true;
  }

}
