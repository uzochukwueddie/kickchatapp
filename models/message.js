const mongoose = require('mongoose'),  
Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({  
    conversationId: {
        type: mongoose.Schema.Types.ObjectId
    },
    sender: {type: String},
    receiver: {type: String},
    message: [
        {
            senderId: {type: mongoose.Schema.Types.ObjectId},
            receiverId: {type: mongoose.Schema.Types.ObjectId},
            sendername: {type: String},
            receivername: {type: String},
            body: {type: String, default: ''},
            isRead: {type: Boolean, default: false},
            imageVersion: {type: String, default: ''},
            imageId: {type: String, default: ''},
            createdAt: {type: Date, default: Date.now},
        }
    ]
});

module.exports = mongoose.model('Message', MessageSchema); 