const express = require("express");
const bodyParser = require("body-parser");
const cookieParser =require("cookie-parser");
const mongoose = require("mongoose");
const config = require('./config/config').get(process.env.NODE_ENV);


const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


// const {User}= require('./models/user');
// const {Book}= require('./models/book');

const books = require('./routes/books')

app.use(bodyParser.json())
app.use(cookieParser());


//USE ROUTES
app.use('/api',books);


const port = process.env.PORT || 3001; 
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})