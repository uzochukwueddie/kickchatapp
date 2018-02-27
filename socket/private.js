module.exports = function(io, _) {


    io.on('connection', (socket) => {
        socket.on('join privatechat', (params) => {
            socket.join(params.room1)
            socket.join(params.room2)
            
            socket.room = params.room1;

        });
        
        socket.on('privateMessage', (to, from, message) => {
            if(socket.room === to){
                io.to(message.room1).emit('new message', {
                    text: message.text,
                    sender: message.sender,
                    receiver: message.receiver
                });
            }
            
        })

        
    });
}
