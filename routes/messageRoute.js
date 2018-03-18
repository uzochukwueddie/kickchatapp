'use strict';

const express = require("express");
const router = express.Router();

const msgCtrl = require('../controllers/message');
const roomMsg = require('../controllers/roomMsg');


router.get('/user/message/:sender/:receiver', msgCtrl.getMessages);
router.get('/message/:userid/:sender', msgCtrl.getMessage);
router.get('/roomname/:roomname', roomMsg.getRoomMessages);
router.get('/receiver/:name', msgCtrl.receiverMessage);


router.post('/user/message/:sender/:receiver', msgCtrl.saveMessage);
router.post('/chatmessages/:receivername', msgCtrl.markMessage);
router.post('/chatmessage/:messageId', msgCtrl.markAsMessage);


router.post('/roomname/:roomname', roomMsg.saveRoomMsg);






module.exports = router;