const express = require('express');
const router = require('./src/routers/routers');
//const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

//let control = false;

// const loadBasicData = require('./src/utils/loadBasicData');

//     if(!control){
//         loadBasicData.getLatest;
//         loadBasicData.getTop;
//         control = true;
//     }



app.use(router);
app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));




app.set('view engine', 'ejs');

app.listen(port, ()=>{
    console.log(`Server is runnig on port ${port}`);
});