const mongoose = require('mongoose');
const validator = require('validator');

module.exports = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         //to made a field required use required property
//         required: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         validate(value){
//             if(value < 30){
//                 throw new Error('Age must be than 30');
//             }
//         }
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       validate(value){
//         if(!validator.isEmail(value)){
//             throw new Error('This is not an emial');
//         };
//     }}

// });
// const me = new User({
//     name: 'Marek',
//     age: 30,
//     email: 'marek@example.com'
// });
// me.save().then((me)=>{
//     console.log(me);
// }).catch((e)=>{
//      console.log(e);
// });