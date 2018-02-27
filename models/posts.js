const mongoose = require('mongoose');

const posts = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: {type: String, default: ''},
    post: {type: String, default: ''},
    comment: [{
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''},
        comment: {type: String, default: ''},
        createdAt: {type: Date, default: Date.now()}
    }],
    likes: {type: Number, default: 0},
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Post', posts);