'use strict';

const express = require("express");
const router = express.Router();
const passport = require('passport');

const locCtrl = require('../controllers/location');


router.get('/location/near/:city', locCtrl.getUsersLocation);

router.post('/user/location/:id', locCtrl.addLocation);



module.exports = router;

