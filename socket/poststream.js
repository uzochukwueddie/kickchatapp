module.exports = function(io) {


    io.on('connection', (socket) => {
        socket.on('join stream', (params) => {
            socket.join(params.room)

        });
        
        socket.on('streamMessage', (message) => {
            io.emit('new stream', {
                post: message.text,
                user: message.sender.user,
                msg: message.post
            });
            
        })

        
    });
}
