var mongoose = require('mongoose');
const Club = require('../models/club');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getRooms = async (req, res) => {
    // const token = getToken(req.headers);
    // console.log(token);
    // if (token) {
    //   var decoded = jwt.verify(token, 'thisisasecret');
    //   console.log(decoded)
    //   const userRes = await User.findOne({username: decoded.username});
    //   const rooms = await Club.find({});
    //   if (!user) {
    //     return res.status(403).send({message: 'Authentication failed. User not found.'});
    //   } else {
    //     return res.status(200).json({
    //       message: 'You are authorized', 
    //       user: user,
    //       rooms: rooms
    //     });
    //   }
    // } else {
    //   return res.status(403).send({message: 'No token provided.'});
    // }

    const rooms = await Club.find({});
    return res.status(200).json({message: 'Rooms Found', rooms: rooms});
}

exports.getUser = async (req, res) => {
    const user = await User.findOne({'username': req.params.username});

    if(!user) {
      return res.status(403).json({message: 'No user Found'})
    } else {
      return res.status(200).json({message: 'User data returned', user: user});
    }
}

exports.getRoom = (req, res) => {
  return res.status(200).json({message: 'Chat Room', room: req.params.name});
}



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