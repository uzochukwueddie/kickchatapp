const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');
const formidable = require('formidable');
const RoomMessage = require('../models/groupmessage');
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const User = require('../models/user');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


exports.addFile = (req, res) => {
    
    cloudinary.uploader.upload(req.body.file, function (resp) {
        const saveData = async () => {
            if(req.body.room){
                const room = new RoomMessage();
                room.senderId = req.body.senderId;
                room.room = req.body.room;
                room.name = req.body.sender;
                room.imageVersion = resp.version;
                room.imageId = resp.public_id;

                const saved = await room.save();

                fs.unlink(req.body.img, function (err) {
                  if (err) throw err;
                  console.log(`successfully deleted ${req.body.img}`);
                });
            }
        }
        
        saveData()
            .then(result => {
                return res.status(200).json({message: 'File added successfully'})
            })
            .catch(err => {
                return res.status(200).json({message: err});
            });
    });
    
}

exports.profileImage = async (req, res) => {
    cloudinary.uploader.upload(req.body.image, async function (resp) {
        const saveData = async () => {
            if(req.body.username){
                const userImage = await User.update({
                    "username": req.body.username
                }, {
                    "userImage": resp.public_id,
                    "imageVersion": resp.version
                });
            }
        }
        
        saveData()
            .then(result => {
                return res.status(200).json({message: 'Profile picture added.'})
            })
            .catch(err => {
                return res.status(200).json({message: err});
            });
    });
}



exports.privateChat = (req, res) => {
    cloudinary.uploader.upload(req.body.file, function (resp) {
        
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;
        
        Conversation.find({$or: [
            {participants: {$elemMatch: {sender:senderId, receiver:receiverId}}},
            {participants: {$elemMatch: {receiver:senderId, sender:receiverId}}}
        ]}, (err, results) => {
            if(results.length > 0){
                const saveData = async () => {
                    await Message.update({
                        'conversationId': results[0]._id
                    }, {
                        $push: {message: {
                            senderId: senderId,
                            receiverId: receiverId,
                            sendername: req.body.sendername,
                            receivername: req.body.receivername,
                            imageId: resp.public_id,
                            imageVersion: resp.version
                        }}
                    })
                }

                saveData()
                    .then(result => {
                        return res.status(200).json({message: 'Image sent successfully'})
                    })
                    .catch(err => {
                        return res.status(200).json({message: err})
                    });

            } else {
                const saveMessage = async () => {
                    
                    const newConversation = new Conversation();
                    newConversation.participants.push({
                        sender: req.body.senderId,
                        receiver: req.body.receiverId
                    });

                    const saveConversation = await newConversation.save();

                    const newMessage = new Message();
                    newMessage.conversationId = saveConversation._id;
                    newMessage.sender = req.body.sendername,
                    newMessage.receiver = req.body.receivername, 
                    newMessage.message.push({
                        senderId: req.body.senderId,
                        receiverId: req.body.receiverId,
                        sendername: req.body.sendername,
                        receivername: req.body.receivername,
                        imageId: resp.public_id,
                        imageVersion: resp.version
                    });


                    await newMessage.save();
                }

                saveMessage()
                    .then(result => {
                        return res.status(200).json({message: 'Image sent successfully'})
                    })
                    .catch(err => {
                        return res.status(200).json({message: err});
                    });
            }
        });  
        
    });
    
}
























