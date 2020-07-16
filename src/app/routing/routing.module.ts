import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes, Router} from '@angular/router';
import {ListComponent} from '../posts/list/list.component';
import {CreateComponent} from '../posts/create/create.component';
import {LoginComponent} from  '../auth/login/login.component';
import {SignupComponent} from  '../auth/signup/signup.component';


const routes:Routes=[
  {path:'',component:ListComponent},
  {path:'login',component:LoginComponent},
  {path:'create',component:CreateComponent},
  {path:'edit/:postId',component:CreateComponent},
  {path:'signup',component:SignupComponent}
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class RoutingModule { }
