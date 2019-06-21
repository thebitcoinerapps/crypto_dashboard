const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();
const User = require('../db/models/user');
const Item = require('../db/models/listing');
const High_item = require('../db/models/listingHighestReturn');
const Url = require('../db/models/urls');
const bcrypt = require('bcryptjs');
const getUrls = require('../utils/getMetaData');
const {deleteAll, updateAll} = require('../utils/refreshData');


let currentId = '';
let cryptoNames = [];
let newHoldings = [];
let currentPrices = [];

//mongodb+srv://cryptodashboard:<password>@cluster0-dio5z.mongodb.net/test?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/cryptodb
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const topGainersDB = require('../db/models/listingHighestReturn');
//const topGainersDBurls = require('../db/models/urls');
let topGainersArr = [];
//let topGainersUrlArr = [];


router.get('/', (req, res)=>{
    
    //read cookies and logon automatically
    res.render('loginPage', {msg: ''});
});

//validation and signing up new users
router.post('/validation', (req, res)=>{
    const {name, email, password} = req.body;
    const newUser = new User({
        name,
        email,
        password
    });
    newUser.save().then((user)=>{
        let id = user._id.toString();
        res.redirect(`/${id}/dashboard`)
    }).catch((err)=>{
        res.render('loginPage', {msg: 'Users exists'});
    });
});
//login existing users
router.post('/login', (req, res)=>{

    const {email, password} = req.body;
    let user = {};
    User.findOne({email: email}, (err, user)=>{
        if(user === null){
            res.render('loginPage', {msg: 'User not found'});
        }
        user = user;
    }).then((user)=>{
        if(user){
        const checkPass = async () => {
            let check = bcrypt.compare(password, user.password);
            return check;
            }
            checkPass().then((check)=>{
                if(check){
                    let id = user._id.toString();
                    res.redirect(`/${id}/dashboard`)
                }else{
                    res.render('loginPage', {msg: 'Wrong password'});
                }
            }).catch((err)=>{
            });}
    })});
//daschboard
router.post('/refresh', (req, res)=>{
    let currentId  = '5d0cadd469763a001797b095'
    //let currentId = req.body.currentId;
    const updatedUrls = async (symbols)=>{
        const urls = await getUrls(symbols);
        return urls;
    }
    deleteAll().then(()=>{
        updateAll().then((data)=>{
            let listingArray = [];
            let topGainersArray = [];
            listingArray = Array.from(JSON.parse(JSON.stringify(data[0].data.data)));
            topGainersArray = Array.from(JSON.parse(JSON.stringify(data[1].data.data)));
            listingArray.forEach((coin)=>{
                const item = new Item({
                    coinId: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    quote: coin.quote.USD.price
                });
                item.save();
            });
            topGainersArray.forEach((coin)=>{
                const high_item = new High_item({
                    coinID: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    percent_change_7d: coin.quote.USD.percent_change_7d
                });
                high_item.save();
            });
            const symbols = topGainersArray.map((coin)=>{
                return coin.symbol;
            });
            updatedUrls(symbols.join()).then((data)=>{
                const metaArray = JSON.parse(JSON.stringify(data.data.data));
                symbols.forEach((symbol)=>{
                    const url = new Url({
                        symbol: symbol,
                        url: metaArray[symbol].logo
                    }).save();
                });
            }).then(()=>{
                console.log('data base updated');
                res.redirect(`/${currentId}/dashboard`);
            });

        });
    });
    
});
// router.get('/updateDbs', (req, res)=>{
//     //api call here
// });


router.get('/:id/dashboard', (req, res)=>{
    let topGainersUrlArr = [];
    let bitcoin = {};
    Item.findOne({name: "Bitcoin"}, (err, coin)=>{
        bitcoin.price = 0;
        if(!coin){
        let price = parseFloat(coin.quote).toFixed(2);
        bitcoin.price = price;
        }
    }).then(()=>{
        topGainersDB.find({}, (err, topgainers)=>{
            topGainersArr = topgainers;
        }).then(()=>{
            Url.find({}, (err, topgainersUrls)=>{
                topGainersUrlArr = topgainersUrls;
            }).then(()=>{
                User.findById(req.params.id, (err, user)=>{
                    let totalValue = 0;
                    let totalValueHistorical = 0;
                    let profit = 0;
                    let rateOfreturn = 0;
                    //do all calculations and pass to dashboard
                    const holdingsArr = Array.from(user.holdings);
                    holdingsArr.forEach((holding)=>{
                        totalValue+=parseFloat(holding.currentPrice);
                        totalValueHistorical+=(parseFloat(holding.price) * parseFloat(holding.quantity));
                    });
                    //profit = parseFloat(totalValueHistorical - totalValue);
                    profit = (parseFloat(totalValue-totalValueHistorical).toFixed(2)).toString();
                    rateOfreturn = profit/totalValueHistorical;
                    res.render('dashboard', {bitcoinPrice: bitcoin, rate: rateOfreturn.toFixed(2), total: totalValue.toFixed(2), user: user, topGArr: topGainersArr, topUrls: topGainersUrlArr, profit: profit});
                });
            })
        })
    })
});
//adding 
router.post('/add', (req, res)=>{
    currentId = req.body.id;
    res.redirect('/addCrypto');
});
router.get('/addCrypto', (req, res)=>{
    Item.find({},(err, listing)=>{
        cryptoNames = listing;
    }).then(()=>{
        res.render('addCrypto',{currentId: currentId, listings: cryptoNames});
    })
    
})
//handling added asset
router.post('/addtoportfolio', (req, res)=>{
    let newName = '';
    const newHolding = req.body;
    const {id} = req.body;
    const {coin_name} = req.body;
    newName = coin_name;
        if(coin_name === 'Binance'){
            newName = 'Binance Coin';
        }
    const {quantity} = req.body;
    try{
        Item.findOne({name: newName}, (err, item)=>{
            newHolding.currentPrice = parseFloat((item.quote * parseFloat(quantity))).toFixed(4);
        });
    }catch{(e)=>{
        console.log(e);
    }
        
    }


    const objId = new mongoose.mongo.ObjectID(id);
    User.findOne({_id:objId}, (err, user)=>{
        newHoldings = Array.from(user.holdings);
        newHoldings.push(newHolding);

    }).then(()=>{
        User.updateOne({_id: objId}, {holdings: newHoldings}, (err, status)=>{
        });
    }).then(()=>{
        res.redirect(`/${id}/dashboard`)
    })
});



module.exports = router;