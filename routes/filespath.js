'use strict';

const express = require("express");
const router = express.Router();

const fileCtrl = require('../controllers/file');



router.post('/v1/post/upload', fileCtrl.addFile);




module.exports = router;