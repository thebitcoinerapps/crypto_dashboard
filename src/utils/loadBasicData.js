const mongoose = require('mongoose');
//utils
const getTopGainers = require('./getLatestHighetReturn');
const getMeta = require('./getMetaData');
const getLatest = require('./getLatest');

//db
const TopGainer = require('../db/models/listingHighestReturn');
const Url = require('../db/models/urls');

//variables
let topGainersArrayRaw = [];
let listingArray = [];

//connecting to database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}, function(error){
    //connection error handling
    
});

//getting top gainers
const getTop = getTopGainers.then((response)=>{
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
    
});
//getting latest cryptoData
const getLatestListing = getLatest.then((response)=>{
    const listing = response.data.data;
    listingArray = Array.from(JSON.parse(JSON.stringify(listing)));
    listingArray.forEach((coin)=>{
        const item = new Item({
            coinId: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            quote: coin.quote.USD.price
        });
        item.save().then((item)=>{
        }).catch((error)=>{
            throw new Error('Saving not finished');
        });
    });
}).catch((error)=>{
});

module.exports = {
    getTop: getTop,
    getLatest: getLatestListing
}
