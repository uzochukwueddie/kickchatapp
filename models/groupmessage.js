const mongoose = require('mongoose'),  
Schema = mongoose.Schema;

const GroupMsgSchema = mongoose.Schema({  
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: {type: String, default: ''},
    name: {type: String},
    room: {type: String},
    imageVersion: {type: String, default: ''},
    imageId: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('GroupMessage', GroupMsgSchema); 