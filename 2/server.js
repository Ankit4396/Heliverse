const express = require('express');
const app = express();
const Router = require('../XBackEnd/routes');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use("/", Router);

const port = 50000;
console.log("Hello Server");
mongoose.connect("mongodb://localhost:27017/Temp",{ useNewUrlParser: true , useUnifiedTopology: true} ).then((result)=>{
    app.listen(port,function(){
        console.log('server'+port);
    });
    console.log("Database connected succesfully");
})
    .catch((err)=>{
        console.log("can't connect to database",err);
    });
