const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();
const User = require('../db/models/user');
const Item = require('../db/models/listing');

let currentId = '';
let cryptoNames = [];
let newHoldings = [];

mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
});

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

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
        console.log(user);
        let id = user._id.toString();
        res.redirect(`/${id}/dashboard`)
    }).catch((err)=>{
        console.log(err);
        res.redirect('loginPage',{msg: 'Error occured'});
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
        if(user.password != password){
            res.redirect('/');
        }else if(user.password = password){
            let id = user._id.toString();
            console.log(id);
            res.redirect(`/${id}/dashboard`)
        }
    });
})
//daschboard

router.get('/:id/dashboard', (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        res.render('dashboard', {user: user});
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
    const {id} = req.body;
    const objId = new mongoose.mongo.ObjectID(id);
    User.findOne({_id:objId}, (err, user)=>{
        newHoldings = Array.from(user.holdings);
        newHoldings.push(req.body);
    }).then(()=>{
        User.updateOne({_id: objId}, {holdings: newHoldings}, (err, status)=>{
            console.log(status);
        });
    }).then(()=>{
        res.redirect(`/${id}/dashboard`)
    })
});



module.exports = router;