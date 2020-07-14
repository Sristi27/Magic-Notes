import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { CreateComponent } from './posts/create/create.component';
import { ListComponent } from './posts/list/list.component';
import{FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material/material.module'
import {RoutingModule} from './routing/routing.module'
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreateComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,MaterialModule,HttpClientModule,RoutingModule,
    BrowserAnimationsModule,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
