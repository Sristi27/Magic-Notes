const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path=require('path');
const postRoutes=require('./routes/posts');

mongoose.connect(
    //"mongodb+srv://app-user:9883362850@cluster0-5meyd.mongodb.net/students?retryWrites=true&w=majority",
    'mongodb://localhost/postsdb',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (!err) {
            console.log("Database connected");
        } else {
            console.log(err);
        }
    }
);

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use( "/images",express.static(path.join("backend/images")))  //gives access to the images folder
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,DELETE,PATCH,PUT,OPTIONS");
    next();
}
)

app.use("/api/posts",postRoutes);


module.exports = app;