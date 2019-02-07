const mongoose = require('mongoose');

const flightSchema = mongoose.Schema({
    departure: {
        type: String,
        required: true
    },
    arrival: {
        type: String,
        required: true
    },
    dep_date: {
        type: Date,
        required: true
    },
    arr_date: {
        type: Date,
        required: true
    },
    dep_time: {
        type: String,
        required: true
    },
    arr_time: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    airline: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Flight', flightSchema);

