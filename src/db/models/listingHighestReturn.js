const mongoose = require('mongoose');

module.exports =  HighestReturn = mongoose.model('HighestReturn', {
    coinId: {},
    name:{},
    symbol: {},
    percent_change_7d: {}
});