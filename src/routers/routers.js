const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();
const User = require('../db/models/user');
const Item = require('../db/models/listing');
const bcrypt = require('bcryptjs');


let currentId = '';
let cryptoNames = [];
let newHoldings = [];
let currentPrices = [];

mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
});

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const topGainersDB = require('../db/models/listingHighestReturn');
const topGainersDBurls = require('../db/models/urls');
let topGainersArr = [];
let topGainersUrlArr = [];


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

router.get('/refresh', (req, res)=>{
        Item.deleteMany({}, function (err) {});
        topGainersDB.deleteMany({}, function(err){});
        topGainersDBurls.deleteMany({}, function(err){});
        res.redirect('/updateDbs');
});
router.get('/updateDbs', (req, res)=>{
    //api call here
});


router.get('/:id/dashboard', (req, res)=>{
    let bitcoin = {};
    Item.findOne({name: "Bitcoin"}, (err, coin)=>{
        let price = parseFloat(coin.quote).toFixed(2);
        bitcoin.price = price;
    });

    topGainersDB.find({}, (err, topgainers)=>{
        topGainersArr = topgainers;
    });
    topGainersDBurls.find({}, (err, topgainersUrls)=>{
        topGainersUrlArr = topgainersUrls;
    });
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
        profit = parseFloat(totalValueHistorical - totalValue);
        rateOfreturn = profit/totalValueHistorical;
        profit = (parseFloat(totalValueHistorical - totalValue).toFixed(2)).toString();
        res.render('dashboard', {bitcoinPrice: bitcoin, rate: rateOfreturn.toFixed(2), total: totalValue.toFixed(2), user: user, topGArr: topGainersArr, topUrls: topGainersUrlArr, profit: profit});
    });
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

    const newHolding = req.body;
    const {id} = req.body;
    const {coin_name} = req.body;
    const {quantity} = req.body;
    try{
        Item.findOne({name: coin_name}, (err, item)=>{
            newHolding.currentPrice = parseFloat((item.quote * parseFloat(quantity))).toFixed(4);
        });
    }catch{

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