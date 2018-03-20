'use strict';

const express = require("express");
const router = express.Router();

const fileCtrl = require('../controllers/file');


router.post('/v1/post/upload', fileCtrl.addFile);
router.post('/v1/private/upload', fileCtrl.privateChat);
router.post('/v1/profile/image/:username', fileCtrl.profileImage);




module.exports = router;