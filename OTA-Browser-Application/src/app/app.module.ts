import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

import { FlightsFindComponent } from './flights/flights-find/flights-find.component';
import { OneWayComponent } from './flights/flights-list/one-way/one-way.component';
import { RoundTripComponent } from './flights/flights-list/round-trip/round-trip.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BookingComponent } from './booking/booking.component';
import { AboutusComponent } from './aboutus/aboutus.component';

import { MatDatepickerModule } from '@angular/material';
import { AngularMaterialModule } from './angular-material.module';

import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    FlightsFindComponent,
    NavbarComponent,
    RoundTripComponent,
    LoginComponent,
    SignupComponent,
    BookingComponent,
    AboutusComponent,
    OneWayComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
