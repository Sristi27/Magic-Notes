import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
//gives methods which check allowed or not

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean |
        import("@angular/router").UrlTree | import("rxjs").Observable<boolean |
        import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {

        const isAuth = this.authService.isAuth();
        if (!isAuth)
            //navigate away
            this.router.navigate(["/login"]);


        return isAuth;

    }

}