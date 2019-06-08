const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/cryptodb', {
    useNewUrlParser: true,
    useCreateIndex: true
});

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
});
const me = new User({
    name: 'Marek',
    age: 30
});
me.save().then((me)=>{
    console.log(me);
}).catch((e)=>{
     console.log(e);
});