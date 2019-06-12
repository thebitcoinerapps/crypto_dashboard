const mongoose = require('mongoose');

module.exports =  Item = mongoose.model('Item', {
    coinId: {},
    name:{},
    symbol: {},
    quote: {}
});