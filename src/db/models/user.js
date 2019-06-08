const mongoose = require('mongoose');

module.exports =  Item = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        /*TODO add validation */
    },
    holdings: {
        type: Array
    }

});