var express = require('express');
var router = express.Router();

const FlightController = require('../../controllers/flights');

/* GET flights/oneway listing. */
router.get('/oneway', FlightController.oneWayFlights);

/* GET flights/roundtrip listing. */
router.get('/roundtrip', FlightController.roundTripFlights);

 
module.exports = router;