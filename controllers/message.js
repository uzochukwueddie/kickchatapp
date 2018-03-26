const User = require('../models/user');
const Message = require('../models/message');
const Conversation = require('../models/conversation');


exports.getMessages = async (req, res) => {
    const senderName = req.params.sender.replace(/-/g, ' '); //use req.body.sender
    const receiverName = req.params.receiver.replace(/-/g, ' '); //use req.body.receiver
    
    let conversations = await Conversation.findOne({
                        $or : [
                            { $and : [ {'participants.sender': senderName}, {'participants.receiver': receiverName} ] },
                            { $and : [ {'participants.sender': receiverName}, {'participants.receiver': senderName} ] }]
                        })
                        .select('_id')
                        .populate('participants.sender')
                        .populate('participants.receiver')
    
    
    if(conversations) {
        const messages = await Message.findOne({"conversationId": conversations._id})
    
        return res.status(200).json({
            message: 'Messages returned successfully', 
            messages: messages
        })
    }
}

exports.getMessage = async (req, res) => {
    const senderName = req.params.sender.replace(/-/g, ' '); //use req.body.sender
            
    Message.aggregate([
        {$match:{$or:[{"sender": senderName}, {"receiver": senderName}]}},
        {$sort:{"nessage.createdAt": -1}},
        {
            $group:{"_id":{
            "last_message_between":{
                $cond:[
                    {
                        $gt:[
                        {$substrBytes:["$sender",0,2]},
                        {$substrBytes:["$receiver",0,2]}]
                    },
                    {$concat:["$sender"," and ","$receiver"]},
                    {$concat:["$receiver"," and ","$sender"]}
                ]
            }
            }, "body": {$first:"$$ROOT"}
            }
        }], function(err, newResult){
        
            let arr = []
            newResult.forEach(function(val){
                let msg = val.body.message;
                
                
                if(msg){
                    var sort = msg.sort(function(a, b){
                        var dateA = new Date(a.createdAt), dateB = new Date(b.createdAt)
                        return dateB-dateA 
                    });

                    const obj = {
                        sender: val.body.sender,
                        receiver: val.body.receiver,
                        message: sort[0],
                        msg: sort
                    }
                    arr.push(obj)
                }
            });

            return res.status(200).json({arr: arr});
        }
    )
}

exports.receiverMessage = async (req, res) => {
    
    const msg = await Message.aggregate([
      {$match: {'message.receivername': req.params.name.replace(/-/g, ' ')}}, //use req.body.name
      {$lookup: {from: 'users', localField: 'message.senderId', foreignField: '_id', as: 'user'} },
      {$unwind: "$message"},
      {$match: {"message.receivername": req.params.name.replace(/-/g, ' ')}}, //use req.body.name
      { $sort: { 'message.createdAt': -1 }}
    ]);
    
    
    if(msg.length > 0){
        return res.status(200).json({message: 'User Messages', messages: msg})
    }
}

exports.markMessage = async (req, res) => {
//    const receiverName = req.params.receivername.replace(/-/g, ' ')
    
    const msg = await Message.aggregate([
      {$match: {$and: [{'message.receivername': req.body.receiver, 'message.sendername':req.body.sender}]}},
      {$unwind: "$message"},
      {$match: {$and: [{'message.receivername': req.body.receiver, 'message.sendername':req.body.sender}]}},
      { $sort: { 'message.createdAt': -1 }}
    ])
    
    if(msg.length > 0){
        msg.forEach(async function(val){
            const msg2 = await Message.update({
                "message._id": val.message._id
            },
            { "$set": { "message.$.isRead": true } }
            )
        })
    }
    
    return res.status(200).json({message: 'Messages marked as read'});
}

exports.markAsMessage = async (req, res) => {
    
//    const msg = await Message.update(
//      { "message._id": req.body.messageId },
//      {$set: {
//        "message.$.isRead": true
//      }}
//    )
    
}


exports.saveMessage = async (req, res) => {
    const senderId = req.params.sender.replace(/-/g, ' ');
    const receiverId = req.params.receiver.replace(/-/g, ' ');
    
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
                        body: req.body.message
                    }}

                });
            }

            saveData()
                .then(result => {
                    return res.status(200).json({message: 'Message sent successfully'})
                })
                .catch(err => {
                    return res.status(200).json({message: err});
                })

        } else {
            const saveMessage = async () => {
                const newConversation = new Conversation();
                newConversation.participants.push({
                    sender: req.params.sender.replace(/-/g, ' '),
                    receiver: req.params.receiver.replace(/-/g, ' ')
                });

                const saveConversation = await newConversation.save();

                const newMessage = new Message();
                newMessage.conversationId = saveConversation._id;
                newMessage.sender = req.body.sendername,
                newMessage.receiver = req.body.receivername, 
                newMessage.message.push({
                    senderId: req.params.sender,
                    receiverId: req.params.sender,
                    sendername: req.body.sendername, 
                    receivername: req.body.receivername, 
                    body: req.body.message
                });

                await newMessage.save()
            }

            saveMessage()
                .then(result => {
                    return res.status(200).json({message: 'Message sent successfully'})
                })
                .catch(err => {
                    return res.status(401).json({message: err});
                });
        }
    })
}