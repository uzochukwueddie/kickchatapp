'use strict';

const express = require("express");
const router = express.Router();
const UserCtrl = require('../controllers/user');
const passport = require('passport');


router.post('/register', UserCtrl.createUser);
router.post('/login', UserCtrl.authUser);

router.get('/auth/protected', passport.authenticate('jwt', {session: false}), UserCtrl.protected);


module.exports = router;

