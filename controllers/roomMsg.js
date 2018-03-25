const User = require('../models/user');
const RoomMessage = require('../models/groupmessage');



exports.getRoomMessages = async (req, res) => {
    var date = new Date();
    var daysToDeletion = 1;
    
    
    const roomMsg = await RoomMessage.find({'room': req.params.roomname.replace(/-/g, ' ')});
    
    if(roomMsg){
        var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));
        const del = await RoomMessage.remove({createdAt : {$lt : deletionDate}});
        
        const msg = await RoomMessage.find({'room': req.params.roomname.replace(/-/g, ' ')});
        
        if(msg){
            return res.status(200).json({message: 'Room Messages', room: msg})
        }
        
    }
    
    
}

exports.saveRoomMsg = async (req, res) => {
//    if(req.body.message){
//        const room = new RoomMessage();
//        room.senderId = req.body.senderId;
//        room.room = req.body.room;
//        room.name = req.body.name;
//        room.message = req.body.message;
//        
//        const saved = await room.save();
//        
//        if(saved){
//            return res.status(200).json({message: 'Message saved successfully'})
//        }
//    }
}