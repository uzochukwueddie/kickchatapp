'use strict';

const express = require("express");
const router = express.Router();

var multipart = require('connect-multiparty')();

const fileCtrl = require('../controllers/file');



router.post('/v1/post/upload', multipart, fileCtrl.addFile);




module.exports = router;