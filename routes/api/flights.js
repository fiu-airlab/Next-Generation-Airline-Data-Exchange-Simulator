var express = require('express');
var router = express.Router();

const Flight = require('../../models/flight');
const modifyDepartureDate = require('../../utils/dates');

/* GET flights listing. */
router.get('/', function (req, res, next) {
  const flightToFind = req.query;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  
  const modifiedDepDate = modifyDepartureDate(flightToFind.dep_date);

  const flightQuery = Flight.find({ dep_date: modifiedDepDate, departure: flightToFind.departure, arrival: flightToFind.arrival });
  let fetchedflights;

  // pagination set-up for when we have the db
  if(pageSize && currentPage) {
    flightQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  console.log(flightToFind);
  
  flightQuery.then(documents => {
    fetchedflights = documents;
    return Flight.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: "Flights fetched successfully!",
      flights: fetchedflights,
      maxFlights: count
    })
  });
});

module.exports = router;