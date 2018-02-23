const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {type: String, default: ''},
    email: {type: String, default: ''},
    password: {type: String, default: ''},
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