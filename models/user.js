const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {type: String, default: ''},
    fullname: {type: String, default: ''},
    email: {type: String, default: ''},
    password: {type: String, default: ''},
    userImage: {type: String, default: 'defaultPic.png'},
    imageVersion: {type: Number, default: 1521534486},
    gender: {type: String, default: ''},
    country: {type: String, default: ''},
    mantra: {type: String, default: ''},
    club: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    request: [{
        username: {type: String, default: ''},
        senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    friends: [{
        name: {type: String, default: ''},
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    }],
    blockedUsers: [],
    blockedBy: [],
    totalRequest: {type: Number, default: 0},
    favClub: Array,
    favTeams: [],
    favPlayers: [],
    city: {type: String, default: ''},
    state: {type: String, default: ''},
    coords: {
        latitude: {type: String, default: ''},
        longitude: {type: String, default: ''},
    },
    passwordResetToken: {type: String, default: ''},
    passwordResetExpires: {type: Date, default: Date.now},
});

userSchema.statics.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.statics.firstUpper = function(username){
    return username.charAt(0).toUpperCase() + username.slice(1);
};

userSchema.methods.compareUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);