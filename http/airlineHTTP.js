const request = require('request');
const xml2js = require('xml2js');
const crypto = require('crypto');

var parser = new xml2js.Parser();

// Will return AirShoppingRS converted to Json
exports.httpRS = function(bodyXML, dep_date, callback) {
    var options = { method: 'POST',
                    url: 'http://35.227.22.121/airshopping',
                    headers: {  'cache-control': 'no-cache',
                                'Content-Type': 'application/xml' },
                    body: bodyXML
                  };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        //parsing the response, TODO: parse in another file
        parser.parseString(body, function (err, result) {
            var offers = result.Response.OffersGroup[0].CarrierOffers[0].Offer;
            var jsonFlight = { flights: [] };
            
            var count = Object.keys(offers).length;
            for (var i = 0; i < count; i++) {
                jsonFlight['flights'].push(
                    {
                        id: crypto.randomBytes(15).toString('hex'),
                        class: "Y",
                        departure: result.Response.DataLists[0].OriginDestList[0].OriginDest[0].OriginCode[0],
                        arrival: result.Response.DataLists[0].OriginDestList[0].OriginDest[0].DestCode[0],
                        airline: "A1",
                        price: offers[i].TotalPrice[0].TotalAmount[0]._,
                        dep_date: dep_date,
                        arr_date: dep_date,
                        dep_time: "10:00AM",
                        arr_time: "11:00AM"
                    }
                );
            }
            console.log(jsonFlight);
            callback(jsonFlight);
        });
    });
};
