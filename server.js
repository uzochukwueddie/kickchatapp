const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const passport = require('passport');
const ejs = require('ejs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {User} = require('./helpers/UserClass');
const {Global} = require('./helpers/globalroom');
const {CountryRoom} = require('./helpers/CountryRoom');
const _ = require('lodash');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');


const app = express();

app.use(compression())
app.use(helmet());



const server = require("http").Server(app);
const io = require("socket.io").listen(server);

app.use(cors());

 app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Credentials", "true");
     res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
 })

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect('mongodb://localhost/chatapp');



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
app.use(bodyParser.json());

app.use(passport.initialize());

const admin = require('./controllers/admin');

//require('./passport/passport-json')(passport);
require('./passport/passport-file')

require('./socket/groupchat')(io, User, _);
require('./socket/private')(io, _);
require('./socket/poststream')(io);
require('./socket/global')(io, Global, _);
require('./socket/country')(io, CountryRoom, _);
require('./socket/profileimg')(io);

const users = require('./routes/users');
const home = require('./routes/homeRoute');
const profile = require('./routes/profileRoute');
const file = require('./routes/filespath');
const message = require('./routes/messageRoute');
const location = require('./routes/locationRoute');
const country = require('./routes/countryRoute');
const reset = require('./routes/resetRoute');

app.use('/api', users);
app.use('/api', home);
app.use('/api', file);
app.use('/api', profile);
app.use('/api', message);
app.use('/api', location);
app.use('/api', country);
app.use('/api', reset);



app.use('/admin', admin);


server.listen(process.env.PORT || 3000, function () {
    console.log('SoccerchatApi running on port 3000');
});