const mongoose = require('mongoose');

  const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        /*TODO add validation */
    },
    password: {
        type: String,
        required: true,
        //add validation
    },
    holdings: {
        type: Array
    }
});

module.exports = User;