'use strict';

const express = require("express");
const router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const fileCtrl = require('../controllers/file');



router.post('/v1/post/upload', multipartMiddleware, fileCtrl.addFile)




module.exports = router;