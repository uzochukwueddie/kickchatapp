'use strict';

const express = require("express");
const router = express.Router();

const profileCtrl = require('../controllers/profile');


router.get('/user/profile/:username', profileCtrl.getProfile);

router.post('/user/profile/:username', profileCtrl.addProfile);
router.post('/user/interest/:username', profileCtrl.addInterest);
router.post('/user/change-password/:username', profileCtrl.changePassword);
router.post('/favplayer/delete/:username', profileCtrl.deleteValues);
router.post('/favteam/delete/:username', profileCtrl.deleteTeam);


module.exports = router;

