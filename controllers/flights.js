const Flight = require('../models/flight');
const modifyDate = require('../utils/dates');
const airShoppingRQ = require('../middleware/xml_schemas/airShoppingRQ');


const http = require('../http_airlines/airShoppingHTTP');

// finding one way flights
exports.oneWayFlights = async (req, res, next) => {
  const flightToFind = req.query;
  console.log(flightToFind);

  const modifiedDepDate = modifyDate(flightToFind.dep_date);
  // building body xml for AirShoppingRQ
  var oneWayXmlRQ = airShoppingRQ.airShoppingRQ(flightToFind.departure, flightToFind.arrival, modifiedDepDate);

  let fetchedFlights = [];

  // aggergating airlines
  http.httpRS('http://35.227.22.121/airshopping', 'A1', oneWayXmlRQ, flightToFind.departure, flightToFind.arrival, modifiedDepDate, (response) => {
    var count = Object.keys(response).length;

    for (var i = 0; i < count; i++) {
      fetchedFlights.push(response[i]);
    }
  })
  http.httpRS('http://104.196.39.30/airshopping', 'A2', oneWayXmlRQ, flightToFind.departure, flightToFind.arrival, modifiedDepDate, (response) => {
    var count = Object.keys(response).length;

    for (var i = 0; i < count; i++) {
      fetchedFlights.push(response[i]);
    }
  })
  http.httpRS('http://35.231.70.136/airshopping', 'A3', oneWayXmlRQ, flightToFind.departure, flightToFind.arrival, modifiedDepDate, (response) => {
    var count = Object.keys(response).length;

    for (var i = 0; i < count; i++) {
      fetchedFlights.push(response[i]);
    }
    //return fetchedFlights;*/
    res.status(200).json({
      message: "Flights fetched successfully!",
      flights: fetchedFlights,
      maxFlights: 10
    });
  })
}


// finding Round Trip flights
exports.roundTripFlights = (req, res, next) => {
  const flightToFind = req.query;
  console.log(flightToFind);

  const modifiedDepDate = modifyDate(flightToFind.dep_date);
  const modifiedArrDate = modifyDate(flightToFind.arr_date);
  // building body xml for both AirShoppingRQ
  var depXmlRQ = airShoppingRQ.airShoppingRQ(flightToFind.departure, flightToFind.arrival, modifiedDepDate);
  var arrXmlRQ = airShoppingRQ.airShoppingRQ(flightToFind.arrival, flightToFind.departure, modifiedArrDate);

  let fetchedDepFlights = [];
  let fetchedArrFlights = [];

  // aggergating airlines
  http.httpRS('http://35.227.22.121/airshopping', 'A1', depXmlRQ, flightToFind.departure, flightToFind.arrival, modifiedDepDate, (response) => {
    var count = Object.keys(response).length;
    for (var i = 0; i < count; i++) {
      fetchedDepFlights.push(response[i]);
    }
  })
  http.httpRS('http://35.227.22.121/airshopping', 'A1', arrXmlRQ, flightToFind.arrival, flightToFind.departure, modifiedArrDate, (response) => {
    var count = Object.keys(response).length;
    for (var i = 0; i < count; i++) {
      fetchedArrFlights.push(response[i]);
    }
  })
  // Airline 2
  http.httpRS('http://104.196.39.30/airshopping', 'A2', depXmlRQ, flightToFind.departure, flightToFind.arrival, modifiedDepDate, (response) => {
    var count = Object.keys(response).length;
    for (var i = 0; i < count; i++) {
      fetchedDepFlights.push(response[i]);
    }
  })
  http.httpRS('http://104.196.39.30/airshopping', 'A2', arrXmlRQ, flightToFind.arrival, flightToFind.departure, modifiedArrDate, (response) => {
    var count = Object.keys(response).length;
    for (var i = 0; i < count; i++) {
      fetchedArrFlights.push(response[i]);
    }
  })
  // Airline 3
  http.httpRS('http://35.231.70.136/airshopping', 'A3', depXmlRQ, flightToFind.departure, flightToFind.arrival, modifiedDepDate, (response) => {
    var count = Object.keys(response).length;
    for (var i = 0; i < count; i++) {
      fetchedDepFlights.push(response[i]);
    }
  })
  http.httpRS('http://35.231.70.136/airshopping', 'A3', arrXmlRQ, flightToFind.arrival, flightToFind.departure, modifiedArrDate, (response) => {
    var count = Object.keys(response).length;
    for (var i = 0; i < count; i++) {
      fetchedArrFlights.push(response[i]);
    }
    res.status(200).json({
      message: "Flights fetched successfully!",
      origin: fetchedDepFlights,
      destination: fetchedArrFlights,
      maxFlights: 10
    });
  })
}