const mongoose = require('mongoose');
const Item = require('./src/db/models/listing');
const High_item = require('./src/db/models/listingHighestReturn');
const Url = require('./src/db/models/urls');


const getLatestListing = require('./src/utils/getLatest');
const getLatestHighestReturn = require('./src/utils/getLatestHighetReturn');
const getMetaData = require('./src/utils/getMetaData');

/************mongose boiler plate */

mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
});
/*************getting higest returns */

// getMetaData.then((response)=>{
//     console.log(response);
// });



let highestReturnArr = [];
let symoblsArray = [];

getLatestHighestReturn.then((response)=>{
    const data = response.data.data;
    highestReturnArr = Array.from(JSON.parse(JSON.stringify(data)));
    highestReturnArr.forEach((coin)=>{
        symoblsArray.push(coin.symbol);
    });
    const symbols = symoblsArray.join();
    getMetaData(symbols).then((metaData)=>{
        const meta = metaData.data.data;
        const metaArr = JSON.parse(JSON.stringify(meta));
        //save url to photo to db
        symoblsArray.forEach((sym)=>{
            const url = new Url({
                symbol: sym,
                url: metaArr[sym].logo
            }).save();
        })
    });

    highestReturnArr.forEach((coin)=>{
        const item = new High_item({
            coinID: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            percent_change_7d: coin.quote.USD.percent_change_7d
        }).save();
    });
})


/************latest data API call */
// let listingArray = [];

// getLatestListing.then((response)=>{
//     const listing = response.data.data;
//     listingArray = Array.from(JSON.parse(JSON.stringify(listing)));
//     listingArray.forEach((coin)=>{
//         const item = new Item({
//             coinId: coin.id,
//             name: coin.name,
//             symbol: coin.symbol,
//             quote: coin.quote.USD.price
//         });
//         item.save().then((item)=>{
//         }).catch((error)=>{
//             throw new Error('Saving not finished');
//         });
//     });
// }).catch((error)=>{
//     console.log(error);
// });
