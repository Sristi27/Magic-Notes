import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes, Router} from '@angular/router';
import {ListComponent} from '../posts/list/list.component';
import {CreateComponent} from '../posts/create/create.component';

const routes:Routes=[
  {path:'',component:ListComponent},
  {path:'create',component:CreateComponent},
  {path:'edit/:postId',component:CreateComponent}
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
