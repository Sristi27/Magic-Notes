import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService:AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const token=this.authService.getToken();
        const authReq=req.clone({
            headers:req.headers.set("Authorization","Bearer " + token)  
            //adds a new header along with a value
            //add token to header
        });
        return next.handle(authReq);
    }
}