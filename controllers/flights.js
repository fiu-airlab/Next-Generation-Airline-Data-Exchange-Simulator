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
  var oneWayXmlRQ = airShoppingRQ.airShoppingRQ(flightToFind.departure, flightToFind.arrival, modifiedDepDate);

  let fetchedFlights;
  const cachedFlights = Flight.find({ 
    dep_date: modifiedDepDate, 
    departure: flightToFind.departure, 
    arrival: flightToFind.arrival,
    airline: "A1" // for testing purposes TODO: Remove
  });
   
  cachedFlights.then(documents => {
      fetchedFlights = documents;
    }).then( () => {
      if (fetchedFlights.length >= 1) {
      console.log('Is cached');
        res.status(200).json({
          message: "Flights fetched successfully!",
          flights: fetchedFlights,
          maxFlights: 10
        })
      }
      else {
        // http connection to Airline
        console.log('Is Not cached');
       http.httpRS(oneWayXmlRQ, modifiedDepDate, (response) => {
         res.status(200).json({
           message: "Flights fetched successfully!",
           flights: response.flights,
           maxFlights: 10
         });
       })
      }
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
  

  let fetchedDepFlights;
  const cachedDepFlights = Flight.find({ 
    dep_date: modifiedDepDate, 
    departure: flightToFind.departure, 
    arrival: flightToFind.arrival,
    airline: "A1" // for testing purposes TODO: Remove
  });

  cachedDepFlights.then(documents => {
    fetchedDepFlights = documents;
  }).then( () => {
    if (fetchedDepFlights.length >= 1) {
      console.log('Is cached');
      // to do caching first flight
    }
    else {
      // http connection to Airline
      console.log('Is Not cached');
      http.httpRS(depXmlRQ, modifiedDepDate, (response) => {

        fetchedDepFlights = response;
        var arrXmlRQ = airShoppingRQ.airShoppingRQ(flightToFind.arrival, flightToFind.departure, modifiedArrDate);

        let fetchedArrFlights;
        const cachedArrFlights = Flight.find({ 
          dep_date: modifiedArrDate, 
          departure: flightToFind.arrival, 
          arrival: flightToFind.departure,
          airline: "A1" // for testing purposes TODO: Remove
        });

        cachedArrFlights.then(documents => {
          fetchedArrFlights = documents;
        }).then( () => {
          if (fetchedArrFlights.length >= 1) {
            console.log('Is cached');
            res.status(200).json({
              message: "Flights fetched successfully!",
              origin: fetchedDepFlights.flights,
              destination: fetchedArrFlights.flights,
              maxFlights: 10
            })
          }
          else {
            // http connection to Airline
            console.log('Is Not cached');
            http.httpRS(arrXmlRQ, modifiedArrDate, (response) => {
              fetchedArrFlights = response;
              res.status(200).json({
                message: "Flights fetched successfully!",
                origin: fetchedDepFlights.flights,
                destination: fetchedArrFlights.flights,
                maxFlights: 10
              });
            })
          }
        });
      })
    }
  });
}