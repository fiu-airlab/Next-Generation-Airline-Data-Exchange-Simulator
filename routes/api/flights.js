var express = require('express');
var router = express.Router();
var flights = require('../../data/hardcoded_data.json');

/* GET flights listing. */
router.get('/', function (req, res, next) {
  const flightToFind = req.query;
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