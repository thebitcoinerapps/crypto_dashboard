const mongoose = require('mongoose');
const Item = require('./src/db/models/listing');
const User = require('./src/db/models/user');

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
            symbol: coin.symbol
        });
        item.save().then((item)=>{
        }).catch((error)=>{
            throw new Error('Saving not finished');
        });
    });
}).catch((error)=>{
    console.log(error);
});

const marek = new User({
    name: 'Marek',
    email: 'marek@example.com',
    holdings: [{name: 'Bitcoin', id: 1},{name: 'Ripple', id: 2},{name: 'Etherum', id: 3}]
});

marek.save().then((user)=>{
    console.log(user);
}).catch((error)=>{
    console.log(error);
})