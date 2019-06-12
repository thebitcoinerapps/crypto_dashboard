const mongoose = require('mongoose');
//utils
const getTopGainers = require('./getLatestHighetReturn');
const getMeta = require('./getMetaData');

//db
const TopGainer = require('../db/models/listingHighestReturn');
const Url = require('../db/models/urls');

//variables
let topGainersArrayRaw = [];

//connecting to database
mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
}, function(error){
    //connection error handling
    console.log(error);
});

//getting top gainers
module.exports = getTopGainers.then((response)=>{
    topGainersArrayRaw = Array.from(JSON.parse(JSON.stringify(response.data.data)));

    topGainersArrayRaw.forEach((coin)=>{
        const topGainer = new TopGainer({
            coinID: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            percent_change_7d: coin.quote.USD.percent_change_7d
        }).save();
    });
    const symbols = topGainersArrayRaw.map((coin)=>{
        return coin.symbol;
    });
    getMeta(symbols.join()).then((metaData)=>{
        const metaArray = JSON.parse(JSON.stringify(metaData.data.data));
        symbols.forEach((symbol)=>{
            const url = new Url({
                symbol: symbol,
                url: metaArray[symbol].logo
            }).save();
        });
    });


}).catch((error)=>{
    console.log(error);
});
