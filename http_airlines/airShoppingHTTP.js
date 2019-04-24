const request = require('request');
const xml2js = require('xml2js');
const Flight = require('../models/flight');
const uuid = require('uuid');

var parser = new xml2js.Parser();

// Will return AirShoppingRS converted to Json
exports.httpRS = function (url, airline, bodyXML, departure, arrival, dep_date, callback) {
    // Checking first for Cached Data
    let fetchedFlights;
    Flight.find({
        dep_date: dep_date,
        departure: departure,
        arrival: arrival
    }).then(documents => {
        fetchedFlights = documents;
    }).then(() => {
        if (fetchedFlights.length >= 1) {
            console.log('Is cached');
            callback(fetchedFlights);
        } else {
            console.log('Is not cached');
            var options = {
                method: 'POST',
                url: url,
                headers: {
                    'cache-control': 'no-cache',
                    'Content-Type': 'application/xml'
                },
                body: bodyXML
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                //parsing the response
                parser.parseString(body, function (err, result) {
                    if (err) throw new Error(err);
                    var offers = result.Response.OffersGroup[0].CarrierOffers[0].Offer;
                    var jsonFlight = {
                        flights: []
                    };

                    var count = Object.keys(offers).length;

                    for (var i = 0; i < count; i++) {
                        jsonFlight['flights'].push({
                            id: uuid(),
                            class: "Y",
                            departure: result.Response.DataLists[0].OriginDestList[0].OriginDest[0].OriginCode[0],
                            arrival: result.Response.DataLists[0].OriginDestList[0].OriginDest[0].DestCode[0],
                            airline: airline,
                            price: offers[i].TotalPrice[0].TotalAmount[0]._,
                            dep_date: dep_date,
                            arr_date: dep_date,
                            dep_time: "10:00AM",
                            arr_time: "11:00AM"
                        });
                        // mongodb storing the flights for caching
                        var flight_instance = new Flight({
                            id: uuid(),
                            class: "Y",
                            departure: result.Response.DataLists[0].OriginDestList[0].OriginDest[0].OriginCode[0],
                            arrival: result.Response.DataLists[0].OriginDestList[0].OriginDest[0].DestCode[0],
                            airline: airline,
                            price: offers[i].TotalPrice[0].TotalAmount[0]._,
                            dep_date: dep_date,
                            arr_date: dep_date,
                            dep_time: "10:00AM",
                            arr_time: "11:00AM"
                        });
                        flight_instance.save(function (err) {
                            if (err) return handleError(err);
                            // saved!
                        });
                    }
                    callback(jsonFlight.flights);
                });
            });
        }
    })
};