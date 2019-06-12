const mongoose = require('mongoose');
const Item = require('./src/db/models/listing');

const getLatestListing = require('./src/utils/getLatest');

/************mongose boiler plate */

mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
});
/************latest data API call */
let listingArray = [];

getLatestListing.then((response)=>{
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
    console.log(error);
});
