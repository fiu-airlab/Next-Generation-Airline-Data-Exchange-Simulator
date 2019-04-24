import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightsFindComponent } from './flights/flights-find/flights-find.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BookingComponent } from './booking/booking.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { OneWayComponent } from './flights/flights-list/one-way/one-way.component';
import { RoundTripComponent } from './flights/flights-list/round-trip/round-trip.component';


const routes: Routes = [{
  path: '', component: FlightsFindComponent,
  }, {
  path: 'flights/one-way', component: OneWayComponent
  }, {
  path: 'flights/round-trip', component: RoundTripComponent
  }, {
  path: 'login', component: LoginComponent,
  }, {
  path: 'signup', component: SignupComponent,
  }, {
    path: 'booking', component: BookingComponent,
  }, {
    path: 'about', component: AboutusComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
