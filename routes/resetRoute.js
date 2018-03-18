const express = require("express");
const router = express.Router();

const resetCtrl = require('../controllers/reset');


router.post('/getcode/user', resetCtrl.getCode);
router.post('/resetpassword/user', resetCtrl.resetPassword);


module.exports = router;