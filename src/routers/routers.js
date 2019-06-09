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
    res.render('loginPage');
});

//validation and signing up new users
router.post('/validation', (req, res)=>{
    console.log(req.body);
    const {name, email, password} = req.body;
    const newUser = new User({
        name,
        email,
        password
    });
    newUser.save().then((user)=>{
        console.log(user);
    }).catch((err)=>{
        console.log(err);
    });
});
//login existing users
router.post('/login', (req, res)=>{

    const {email, password} = req.body;

    User.find({email: email}).then((user)=>{
        if(user.length < 1){
            res.redirect('/');
        }else if(user[0].password = password){
            const id = user[0]._id.toString();
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
    User.findOne({email:'marek@example.com'}, (err, user)=>{
        newHoldings = Array.from(user.holdings);
        newHoldings.push(req.body);
    }).then(()=>{
        User.updateOne({email: 'marek@example.com'}, {holdings: newHoldings}, (err, status)=>{
            console.log(status);
        });
    }).then(()=>{
        res.redirect(`/${id}/dashboard`)
    })
});



module.exports = router;