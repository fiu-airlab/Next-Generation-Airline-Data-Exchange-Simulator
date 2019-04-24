import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FlightListService } from '../flights/flight-list.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.css', ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  userisAunthenticated = false;
  badge = 0;
  first_name = '';
  last_name = '';

  private flightsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService, private flightService: FlightListService, private router: Router) {}

  ngOnInit() {
    this.userisAunthenticated = this.authService.getIsAuth();
    if (this.userisAunthenticated) {
      this.first_name = this.authService.first_name;
      this.last_name = this.authService.last_name;
    }
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userisAunthenticated = isAuthenticated;
      this.first_name = this.authService.first_name;
      this.last_name = this.authService.last_name;
    });

    this.flightsSub = this.flightService
    .getFlightToBookUpdateListener()
    .subscribe(flightsToBookCount => {
      this.badge = flightsToBookCount.flightToUpdateCount;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.flightsSub.unsubscribe();
  }
  onBooking() {
    setTimeout(() => this.router.navigate(['/booking']), 300);
  }
  onSearch() {
    setTimeout(() => this.router.navigate(['/']), 300);
  }
  onAboutUs() {
    setTimeout(() => this.router.navigate(['/about']), 300);
  }
}
