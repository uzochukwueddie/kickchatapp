'use strict';

const express = require("express");
const router = express.Router();
const passport = require('passport');

const homeCtrl = require('../controllers/home');


router.get('/home', homeCtrl.getRooms);
router.get('/user/:username', homeCtrl.getUser);
router.get('/room/:name', homeCtrl.getRoom);
// router.get('/protected', passport.authenticate('jwt', {session: false}), homeCtrl.protected);


module.exports = router;

