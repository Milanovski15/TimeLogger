const express = require('express');
const morgan = require('morgan');
const path=require('path');
const app=require('./app');
const moment=require('moment');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const config=require('./config.js');
const appRoutes = require('./routes/routes');

app.use(express.static(path.join(__dirname, '/public')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = config.APP_PORT || 4000;

app.listen(port);
console.log("The app is listening on port " + port );


app.use('/api', appRoutes);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', function (req, res, next) {
    res.sendfile('./public/stylesheets/index.html');
});