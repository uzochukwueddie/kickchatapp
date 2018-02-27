'use strict';

const express = require("express");
const router = express.Router();
const passport = require('passport');

const homeCtrl = require('../controllers/home');


router.get('/home', homeCtrl.getRooms);
router.get('/user/:username', homeCtrl.getUser);
router.get('/room/:name', homeCtrl.getRoom);
router.get('/user/:username/posts', homeCtrl.getPost);
router.get('/user/:username/comments/:postId', homeCtrl.getComments);

router.post('/user/:username', homeCtrl.addFriend);
router.post('/home', homeCtrl.addFavorite);
router.post('/user/:username/posts', homeCtrl.addPost);
router.post('/user/:username/comments/:postId', homeCtrl.postComments);



// router.get('/protected', passport.authenticate('jwt', {session: false}), homeCtrl.protected);


module.exports = router;

