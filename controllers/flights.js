const Flight = require('../models/flight');
const modifyDate = require('../utils/dates');
const airShoppingRQ = require('../middleware/xml_schemas/airShoppingRQ');
const http = require('../http/airlineHTTP');

// finding one way flights
exports.oneWayFlights = async (req, res, next) => {
  const flightToFind = req.query;
  console.log(flightToFind);

  const modifiedDepDate = modifyDate(flightToFind.dep_date);
  // building body xml for AirShoppingRQ
  var oneWayXmlRQ = airShoppingRQ.airShoppingRQ(flightToFind, modifiedDepDate);
  // http connection to Airline
  http.httpRS(oneWayXmlRQ, modifiedDepDate, (response) => {
    res.status(200).json({
      message: "Flights fetched successfully!",
      flights: response.flights,
      maxFlights: 10
    });
  })
}

// finding Round Trip flights
exports.roundTripFlights = (req, res, next) => {
  const flightToFind = req.query;
  console.log(flightToFind);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const modifiedDepDate = modifyDate(flightToFind.dep_date);
  const modifiedArrDate = modifyDate(flightToFind.arr_date);

  const depFlightQuery =  Flight.find({ dep_date: modifiedDepDate, departure: flightToFind.departure, arrival: flightToFind.arrival});
  const arrFlightQuery =  Flight.find({ dep_date: modifiedArrDate, departure: flightToFind.arrival, arrival: flightToFind.departure});

  let fetchedDepFlights;
  let fetchedArrFlights;

  if(pageSize && currentPage) {
    depFlightQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);

    arrFlightQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  depFlightQuery.then(documents => {
    fetchedDepFlights = documents;
  }).then( () =>{

  arrFlightQuery.then(documents => {
    fetchedArrFlights = documents;
  })
  .then( () => {
    console.log(fetchedDepFlights);
    console.log(fetchedArrFlights);
    res.status(200).json({
      message: "Flights fetched successfully!",
      origin: fetchedDepFlights,
      destination: fetchedArrFlights,
      maxFlights: 10
    })
  })});
}