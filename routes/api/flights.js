var express = require('express');
var router = express.Router();
var flights = require('../../data/hardcoded_data.json');

const Flight = require('../../models/flight');

/* GET flights listing. */
router.get('/', function (req, res, next) {
  const flightToFind = req.query;
  const pageSize = req.query.pagesize;
  const currentPage = req.query.page;
  const flight = new Flight({
    departure: 'JFK',
    arrival: 'MIA',
    dep_date: '03/21/2019',
    arr_date: '03/21/2019',
    dep_time: "7:35 PM",
    arr_time: "11:30 PM",
    class: 'Y',
    price: '10.98',
    airline: 'American Airlines',
  });
  // pagination set-up for when we have the db
  if(pageSize && currentPage) {

  }

  console.log(flightToFind);
  console.log(flights);

 /*
  data to use for querying.  
  flightToFind.id;
  flightToFind.departure;
  flightToFind.arrival;
  flightToFind.dep_date;
  flightToFind.arr_date; 
  flightToFind.class;
  flightToFind.trip; */
  
  res.status(200).json({
    message: 'flights fetched successully!',
    flights: flights.flights
  });
});

module.exports = router;