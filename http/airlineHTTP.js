const request = require('request');
const convert = require('xml-js');

// Will return AirShoppingRS converted to Json
exports.httpRS = function(bodyXML) {
    var options = { method: 'POST',
                    url: 'http://35.227.22.121/airshopping',
                    headers: {  'cache-control': 'no-cache',
                                'Content-Type': 'application/xml' },
                    body: bodyXML
                  };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var convertedJson = convert.xml2json(body, {compact: false, spaces: 4});
        return convertedJson;
    });
};