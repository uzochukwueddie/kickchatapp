const User = require('../models/user');
const Message = require('../models/message');
const Conversation = require('../models/conversation');


exports.getMessages = async (req, res) => {
    
    let conversations = await Conversation.findOne({
                        $or : [
                            { $and : [ {'participants.sender': req.params.sender}, {'participants.receiver': req.params.receiver} ] },
                            { $and : [ {'participants.sender': req.params.receiver}, {'participants.receiver': req.params.sender} ] }]
                        })
                        .select('_id')
                        .populate('participants.sender')
                        .populate('participants.receiver')
    
    
    if(conversations) {
        const messages = await Message.findOne({"conversationId": conversations._id});
    
        return res.status(200).json({
            message: 'Messages returned successfully', 
            messages: messages
        })
    }
}

exports.getMessage = async (req, res) => {
            
    Message.aggregate([
        {$match:{$or:[{"sender":req.params.sender}, {"receiver":req.params.sender}]}},
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
      {$match: {'message.receivername': req.params.name}},
      {$unwind: "$message"},
      {$match: {"message.receivername": req.params.name}},
      { $sort: { 'message.createdAt': -1 }}
    ])
    
    if(msg.length > 0){
        return res.status(200).json({message: 'User Messages', messages: msg})
    }
}

exports.markMessage = async (req, res) => {
    
    const msg = await Message.aggregate([
      {$match: {'message.receivername': req.params.receivername}},
      {$unwind: "$message"},
      {$match: {"message.receivername": req.params.receivername}},
      { $sort: { 'message.createdAt': -1 }}
    ])
    
    msg.forEach(async function(val){
        const msg2 = await Message.update({
            "message._id": val.message._id
        },
        { "$set": { "message.$.isRead": true } }
        )
    })
    
    return res.status(200).json({message: 'Messages marked as read'});
}

exports.markAsMessage = async (req, res) => {
    
    const msg = await Message.update(
      { "message._id": req.body.messageId },
      {$set: {
        "message.$.isRead": true
      }}
    )
    
}


exports.saveMessage = async (req, res) => {
    const senderId = req.params.sender;
    const receiverId = req.params.receiver;
    
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
                    sender: req.params.sender,
                    receiver: req.params.receiver
                });

                const saveConversation = await newConversation.save();

                const newMessage = new Message();
                newMessage.conversationId = saveConversation._id;
                newMessage.sender = req.body.sendername,
                newMessage.receiver = req.body.receivername, 
                newMessage.message.push({
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