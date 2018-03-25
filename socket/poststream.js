module.exports = function(io) {


    io.on('connection', (socket) => {
        socket.on('join stream', (params) => {
            socket.join(params.room)

        });
        
        socket.on('streamMessage', (message) => {
            io.emit('new stream', {
                post: message.text,
                user: message.sender.user,
                msg: message.post,
                isUser: true,
                sender: message.sender.user.username
            });
        });
        
        socket.on('post-img', (message) => {
            io.to(message.room).emit('post stream', {
                post: message.text,
                user: message.sender.user,
                image: message.image,
                msg: ''
            });
        })

        
    });
}
