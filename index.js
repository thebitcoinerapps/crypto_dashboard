const express = require('express');
const router = require('./src/routers/routers');

const app = express();
const port = process.env.PORT || 3000;

app.use(router);
app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.listen(port, ()=>{
    console.log(`Server is runnig on port ${port}`);
});