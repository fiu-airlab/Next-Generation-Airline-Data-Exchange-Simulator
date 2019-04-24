import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlightFind } from './flight-find.model';
import { FlightList } from './flight-list.model';
import { map,  } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

@Injectable({providedIn: 'root'})
export class FlightListService {
  private flights: FlightList[] = [];
  // for round trip
  private origin: FlightList[] = [];
  private destination: FlightList[] = [];

  private flightsUpdated = new Subject<{ flights: FlightList[], flightCount: number}>();
  private roundTripUpdated = new Subject<{ origin: FlightList[], destination: FlightList[], flightCount: number}>();
  private flightsToBookCount = new Subject<{ flightToUpdateCount: number }>();
  public flightsToBook: FlightList[] = [];

  // cached flights
  public cachedFlights: any = [];

  public flight: FlightFind;

  constructor(private http: HttpClient) {}


  getFlightUpdateListener() {
    return this.flightsUpdated.asObservable();
  }
  getRoundTripUpdateListener() {
    return this.roundTripUpdated.asObservable();
  }
  getFlightToBookUpdateListener() {
    return this.flightsToBookCount.asObservable();
  }

  searchOneWayFlight(flightsPerPage: number, currentPage: number) {
    const  params = new  HttpParams()
      .set('id', null)
      .set('departure', this.flight.departure)
      .set('arrival', this.flight.arrival)
      .set('dep_date', this.flight.dep_date)
      .set('arr_date', this.flight.arr_date)
      .set('class', this.flight.class)
      .set('trip', this.flight.trip);

    this.http
      .get<{message: string, flights: any, maxFlights: number}>('http://localhost:3000/api/flights/oneway', { params })
      .pipe(map((flightData) => {
        return { flights: flightData.flights.map(flight => {
          return {
            departure: flight.departure,
            arrival: flight.arrival,
            dep_date: flight.dep_date,
            arr_date: flight.arr_date,
            dep_time: flight.dep_time,
            arr_time: flight.arr_time,
            class: flight.class,
            price: flight.price,
            airline: flight.airline,
            id: flight.id,
          };
        }),
        maxFlights: flightData.maxFlights
      };
      }))
      .subscribe( transformedFlightData => {
        // this.addFlightsToCache(transformedFlightData.flights);
        // console.log(this.cachedFlights);
        this.flights = transformedFlightData.flights;
        this.flightsUpdated.next({
          flights: [...this.flights],
          flightCount: transformedFlightData.maxFlights
        });
      });
  } 
  searchRoundTripFlight(flightsPerPage: number, currentPage: number) {
    const  params = new  HttpParams()
      .set('id', null)
      .set('departure', this.flight.departure)
      .set('arrival', this.flight.arrival)
      .set('dep_date', this.flight.dep_date)
      .set('arr_date', this.flight.arr_date)
      .set('class', this.flight.class)
      .set('trip', this.flight.trip);

    this.http
      .get<{message: string, origin: any, destination: any, maxFlights: number}>('http://localhost:3000/api/flights/roundtrip', { params })
      .pipe(map((flightData) => {
        console.log(flightData);
        return {
          origin: flightData.origin
          .map(flightorigin => {
            return {
              departure: flightorigin.departure,
              arrival: flightorigin.arrival,
              dep_date: flightorigin.dep_date,
              arr_date: flightorigin.arr_date,
              dep_time: flightorigin.dep_time,
              arr_time: flightorigin.arr_time,
              class: flightorigin.class,
              price: flightorigin.price,
              airline: flightorigin.airline,
              id: flightorigin._id,
            };
          }),
          destination: flightData.destination
          .map(flightdestination => {
            return {
              departure: flightdestination.departure,
              arrival: flightdestination.arrival,
              dep_date: flightdestination.dep_date,
              arr_date: flightdestination.arr_date,
              dep_time: flightdestination.dep_time,
              arr_time: flightdestination.arr_time,
              class: flightdestination.class,
              price: flightdestination.price,
              airline: flightdestination.airline,
              id: flightdestination._id,
            };
          }),
          maxFlights: flightData.maxFlights
      };
      })
    )
    .subscribe((transformedFlightData) => {
      this.origin = transformedFlightData.origin;
      this.destination = transformedFlightData.destination;

      this.roundTripUpdated.next({
        origin: [...this.origin],
        destination: [...this.destination],
        flightCount: transformedFlightData.maxFlights
      });
    });
  }
  addToCart(id: any) {
    if (this.flights.find(x => x.id === id)) {
      this.flightsToBook.push(this.flights.find(x => x.id === id));
      this.flightsToBookCount.next(
        { flightToUpdateCount: this.flightsToBook.length }
      );
      console.log(this.flightsToBook);
    }
    if (this.origin.find(x => x.id === id)) {
      this.flightsToBook.push(this.origin.find(x => x.id === id));
      this.flightsToBookCount.next(
        { flightToUpdateCount: this.flightsToBook.length }
      );
      console.log(this.flightsToBook);
    }
    if (this.destination.find(x => x.id === id)) {
      this.flightsToBook.push(this.destination.find(x => x.id === id));
      this.flightsToBookCount.next(
        { flightToUpdateCount: this.flightsToBook.length }
      );
      console.log(this.flightsToBook);
    }
  }
  removeFromCart(id: any) {
    // get index of object with id
    const removeIndex = this.flightsToBook.map(function(item) { return item.id; }).indexOf(id);

    // remove object
    this.flightsToBook.splice(removeIndex, 1);
    this.flightsToBookCount.next(
      { flightToUpdateCount: this.flightsToBook.length }
    );
  }

  // Local Cache Functionality
  addFlightsToCache(flights) {
    const now = new Date();
    this.cachedFlights.push({
      id: uuid(),
      departure: this.flight.departure,
      arrival: this.flight.arrival,
      dep_date: this.flight.dep_date,
      flightList: flights,
      expirationTime: new Date(now.getTime() + 1200 * 1000)
    });
  }
  isCached() {
    let isCached = true;
    // if cached Flights is empty.
    if (this.cachedFlights === undefined || this.cachedFlights.length === 0) {
      return false;
    }

    // if same dep_date, dep, arr.
    this.cachedFlights.forEach(query => {
      isCached = (query.departure === this.flight.departure && query.arrival === this.flight.arrival
        && String(query.dep_date) === String(this.flight.dep_date));
      if (isCached) {
        // TODO: check expiration
        return true;
      }
    });
    return isCached;
  }
  useCachedFlights() {
    this.cachedFlights.forEach(query => {
      if (query.departure === this.flight.departure && query.arrival === this.flight.arrival
        && String(query.dep_date) === String(this.flight.dep_date)) {
          console.log(query.flightList);
          return query.flightList;
      }
    });
    return [];
  }
  deleteFlightsFromCache() {
    // test
  }
}
