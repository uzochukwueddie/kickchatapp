const mongoose = require('mongoose');


const ConversationSchema = mongoose.Schema({  
    participants: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);    