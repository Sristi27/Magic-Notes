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
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthInterceptor} from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CreateComponent,
    ListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,MaterialModule,HttpClientModule,RoutingModule,
    BrowserAnimationsModule,ReactiveFormsModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass: AuthInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
