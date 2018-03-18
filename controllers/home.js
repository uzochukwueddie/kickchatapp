var mongoose = require('mongoose');
const Club = require('../models/club');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Post = require('../models/posts');
const moment = require('moment');
const _ = require('lodash');

exports.getRooms = async (req, res) => {
    const rooms = await Club.find({}).sort({"name": 1})
    return res.status(200).json({message: 'Rooms Found', rooms: rooms});
}

exports.getUser = async (req, res) => {
    const user = await User.findOne({'username': req.params.username}, {'password': 0});

    if(!user) {
      return res.status(403).json({message: 'No user Found'})
    } else {
      return res.status(200).json({message: 'User data returned', user: user});
    }
}

exports.getRoom = (req, res) => {
  return res.status(200).json({message: 'Chat Room', room: req.params.name});
}

exports.addFriend = async (req, res) => {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    
    const senderName = req.body.senderName;
    const receiverName = req.body.receiverName;
    
    const sendername = req.body.sendername;
    const receivername = req.body.receivername;
    
    //...............Sending request...........................
    
    await User.update({
        'username': receiver,
        'request.username': {$ne: req.body.sender},
        'friends.name': {$ne: req.body.sender}
    }, {
        $push: {request: {
            username: req.body.sender
        }},
        $inc: {totalRequest: 1}
    });
    
    await User.update({
        'username': sender,
        'sentRequest.username': {$ne: req.body.receiver}
    }, {
        $push: {sentRequest: {
            username: req.body.receiver
        }}
    });
    
    //...............End...........................
    
    //...............Accepting request...........................
    
    await User.update({
        'username': receiverName,
        'friends.name': {$ne: req.body.senderName}
    }, {
        $push: {friends: {
            name: req.body.senderName
        }},
        $pull: {request: {
            username: req.body.senderName
        }},
        $inc: {totalRequest: -1}
    });
    
    await User.update({
        'username': senderName,
        'friends.name': {$ne: req.body.receiverName}
    }, {
        $push: {friends: {
            name: req.body.receiverName
        }},
        $pull: {sentRequest: {
            username: req.body.receiverName
        }},
    });
    
    //...............End...........................
    
    //...............Cancelling request...........................
    
    await User.update({
        'username': receivername,
        'request.username': {$eq: req.body.sendername}
    }, {
        $pull: {request: {
            username: req.body.sendername
        }},
        $inc: {totalRequest: -1}
    });
    
    await User.update({
        'username': sendername,
        'sentRequest.username': {$eq: req.body.receivername}
    }, {
        $pull: {sentRequest: {
            username: req.body.receivername
        }},
    });
    
    //...............End...........................
    
    if(sender && receiver) {
        return res.status(200).json({message: 'Friend request sent'});
    } else if(senderName && receiverName) {
        return res.status(200).json({message: 'Friend request accepted'});
    } else if(sendername && receivername) {
        return res.status(200).json({message: 'Friend request cancelled'});
    }
}

exports.addFavorite = async (req, res) => {
    await Club.update({
        '_id': req.body.id,
        'fans.username': {$ne: req.body.user}
    }, {
        $push: {fans: {
            username: req.body.user
        }}
    });
    
    await User.update({
        'username': req.body.user,
        'favClub': {$ne: req.body.roomName}
    }, {
        $push: {favClub: req.body.roomName}
    })
    
    return res.status(200).json({message: `${req.body.roomName} has been added to favorite`});
}

exports.getPost = async (req, res) => {
    var today = moment().startOf('day')
    var tomorrow = moment(today).add(1, 'days')
    
    const posts = await Post.find({"created": {$gte: today.toDate(), $lt: tomorrow.toDate()}})
                            .populate("user")
                            .sort({ "created": -1 });

    
    const topPost = await Post.find({"created": {$gte: today.toDate(), $lt: tomorrow.toDate()}, "likes": {$gt: 10}})
                            .populate("user")
                            .sort({ "likes": -1 });
    
    
    return res.status(200).json({message: `All User's Posts`, posts: posts, top: topPost});
}

exports.addPost = async (req, res) => {
    const userId = req.body.id;
    const username = req.body.username;
    const post = req.body.post;
    
    const newPost = new Post();
    newPost.user = userId;
    newPost.username = username;
    newPost.post = post;
    newPost.created = new Date();
    
    const post2 = await newPost.save();
    
    return res.status(200).json({message: 'Post Added', posts: post2});
}

exports.getComments = async (req, res) => {
    const userComment = await Post.findOne({"_id": req.params.postId})
                                        .populate("user")
                                        .populate("comment.id");
    
    return res.status(200).json({message: 'Users Comments', comments: userComment});
}

exports.postComments = async (req, res) => {
    const postid = req.body.postid;
    const userId = req.body.userid;
    const senderId = req.body.senderId;
    const senderName = req.body.senderName;
    const comment = req.body.comment;
    
    const postId = req.body.postId;
    
    await Post.update({
        "_id": postid
    }, {
        $push: {comment: {
            id: senderId,
            username: senderName,
            comment: comment,
            createdAt: new Date()
        }}
    });
    
    await Post.update({
        "_id": postId
    }, {
        $inc: {likes: 1}
    });
    
    const userComment = await Post.findOne({"_id": req.body.postid})
                                        .populate("user")
                                        .populate("comment.id");
    
    if(postId){
        return res.status(200).json({message: 'Post Liked'});
    } else {
        return res.status(200).json({message: 'Comment Added', comments: userComment});
    }
}

exports.searchRoom = async (req, res) => {
    const regex = new RegExp(req.body.room, 'gi');
    const room = await Club.find({"name": regex});
    
    if(room){
        return res.status(200).json({message: 'Search Results', rooms: _.uniqBy(room, 'name')});
    } else {
        return res.status(200).json({message: 'Search Results Error', rooms: []});
    }
}

exports.addRoom = async (req, res) => {
    const newClub = new Club();
    newClub.name = firstUpper(req.body.room)
    newClub.country = firstUpper(req.body.country)
    newClub.save((err) => {
        if(err){
            return res.status(200).json({message: 'Room Creation Error', error: err});
        }
        return res.status(200).json({message: 'Room Created', room: newClub});
    });
}

exports.blockUser = async (req, res) => {
    
    await User.update({
        'username': req.body.user1,
        'friends.name': req.body.user2,
        'blockedUsers': {$ne: req.body.user2},
    }, {
        $push: {blockedUsers: req.body.user2}
    });
    
    await User.update({
        'username': req.body.user2,
        'friends.name': req.body.user1,
        'blockedBy': {$ne: req.body.user1},
    }, {
        $push: {blockedBy: req.body.user1}
    });
    
    return res.status(200).json({message: 'User Blocked'});
}

exports.unblockUser = async (req, res) => {
    
    await User.update({
        'username': req.body.user1
    }, {
        $pull: { blockedUsers: { $in: [req.body.user2] }}
    });
    
    await User.update({
        'username': req.body.user2,
        
    }, {
        $pull: { blockedBy: { $in: [req.body.user1] }}
    });
    
    return res.status(200).json({message: 'User Unblocked'});
}


firstUpper = function(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
};


getToken = function (headers) {
  console.log(headers.authorization)
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };