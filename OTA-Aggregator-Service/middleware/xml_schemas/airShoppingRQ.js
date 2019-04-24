const builder = require('xmlbuilder');

exports.airShoppingRQ = function(departure, arrival, modifiedDepDate) {
    var oneWayXmlRQ = builder.create('Request')
    .ele('FlightCriteria')
        .ele('OriginDestCriteria')
        .ele('DestArrivalCriteria')
            .ele('IATALocationCode', arrival).up()
        .up()
        .ele('OriginDepCriteria')
            .ele('Date', modifiedDepDate).up()
            .ele('IATALocationCode', departure).up()
        .up()
        .up()
    .up()
    .ele('Paxs')
        .ele('Pax')
        .ele('PaxID', 'Pax1').up()
        .ele('PTC', 'ADT').up()
        .up()
    .up()
    .ele('ShoppingCriteria')
        .ele('CarrierCriteria')
        .ele('Carrier')
            .ele('AirlineDesigCode', 'XB').up()
        .up()
        .up()
        .ele('FlightCriteria')
        .ele('CabinType')
            .ele('CabinTypeCode', '3').up()
        .up()
        .up()
    .up().end({ pretty: true});
    console.log(oneWayXmlRQ);
    return oneWayXmlRQ;
};