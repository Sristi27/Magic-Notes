import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private authService: AuthService) { }

  authListener: Subscription;
  status: boolean = false;
  ngOnInit(): void {

    this.authListener = this.authService.getAuthStatus().subscribe(
      loggedIn => {
        this.status = loggedIn;
      }
    )

  }

  onLogout() {
    //clear the token and inform all the components
    this.authService.logoutUser();
  }


  ngOnDestroy(): void {
    this.authListener.unsubscribe();

  }

}
