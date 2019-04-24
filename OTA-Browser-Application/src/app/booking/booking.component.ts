import { Component, OnInit } from '@angular/core';
import { FlightListService } from '../flights/flight-list.service';
import { FlightList } from '../flights/flight-list.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  flights: FlightList[] = [];
  totalCost = 0;

  constructor(private flightService: FlightListService, private router: Router) { }

  ngOnInit() {
    this.flights = this.flightService.flightsToBook;
    this.flights.forEach(flight => {
      this.totalCost += +flight.price;
    });
  }

  onRemoveFromCart(id: any) {
    this.flightService.removeFromCart(id);
    this.totalCost = 0;
    this.flights.forEach(flight => {
      this.totalCost += +flight.price;
    });
    setTimeout(() => this.router.navigate(['/booking']), 200);
  }

}
