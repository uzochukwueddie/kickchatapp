const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const ejs = require('ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {User} = require('./helpers/UserClass');
const _ = require('lodash');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');


const app = express();

app.use(compression())
app.use(helmet());


const server = require("http").Server(app);
const io = require("socket.io").listen(server);



app.use(cors());

 app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
 })

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());

const admin = require('./controllers/admin');

require('./passport/passport-json')(passport);

require('./socket/groupchat')(io, User, _);
require('./socket/private')(io, _);
require('./socket/poststream')(io);

const users = require('./routes/users');
const home = require('./routes/homeRoute');
const file = require('./routes/filespath');

app.use('/api', users);
app.use('/api', home);
app.use('/api', file);

app.use('/admin', admin);


server.listen(3000, function () {
    console.log('ChatApi running on port 3000');
});