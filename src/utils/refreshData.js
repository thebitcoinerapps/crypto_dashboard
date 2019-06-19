const mongoose = require('mongoose');
const Item = require('../db/models/listing');
const High_item = require('../db/models/listingHighestReturn');
const Url = require('../db/models/urls');

const getLatestListing = require('./getLatest');
const getTopGainers = require('./getLatestHighetReturn');
const getUrls = require('./getMetaData');

/************mongose boiler plate */

mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
});



const deleteAll = async()=>{

    const urls = await Url.deleteMany({},(err)=>{
        if(!err){
            console.log('Url deleted');
        }
    });
    const highRet = await High_item.deleteMany({}, (err)=>{
        if(!err){
            console.log('Top gainers db removed');
        }
    });
    const items = await Item.deleteMany({}, (err)=>{
        if(!err){
            console.log('Listing removed');
        }
    });
}
//updating
const updateListing = async ()=>{
    const listing =  await getLatestListing;
    const topGainers = await getTopGainers;
    //const Urls = await getUrls(symbols);
    const data = [listing, topGainers];
    return data;
 }
//  const updatedUrls = async (symbols)=>{
//      const urls = await getUrls(symbols);
//      return urls;
//  }

// const updateAll = updateListing().then((data)=>{
//     let listingArray = [];
//     let topGainersArray = [];
//     listingArray = Array.from(JSON.parse(JSON.stringify(data[0].data.data)));
//     topGainersArray = Array.from(JSON.parse(JSON.stringify(data[1].data.data)));
//     listingArray.forEach((coin)=>{
//         const item = new Item({
//             coinId: coin.id,
//             name: coin.name,
//             symbol: coin.symbol,
//             quote: coin.quote.USD.price
//         });
//         item.save();
//     });
//     topGainersArray.forEach((coin)=>{
//         const high_item = new High_item({
//             coinID: coin.id,
//             name: coin.name,
//             symbol: coin.symbol,
//             percent_change_7d: coin.quote.USD.percent_change_7d
//         });
//         high_item.save();
//     });
//     const symbols = topGainersArray.map((coin)=>{
//         return coin.symbol;
//     });
//     updatedUrls(symbols.join()).then((data)=>{
//         const metaArray = JSON.parse(JSON.stringify(data.data.data));
//         symbols.forEach((symbol)=>{
//             const url = new Url({
//                 symbol: symbol,
//                 url: metaArray[symbol].logo
//             }).save();
//         });
//     });
//     console.log('data base updated');
// });
module.exports = {
    deleteAll: deleteAll,
    updateAll: updateListing
}