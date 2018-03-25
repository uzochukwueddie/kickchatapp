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
        });
        
        socket.on('add-img', (to, from, message) => {
            if(socket.room === to){
                io.to(message.room1).emit('new message', {
                    image: message.image,
                    sender: message.sender,
                    receiver: message.receiver
                })
            }
        });
        
        socket.on('newRefresh', () => {
            io.emit('newrefreshPage', {}) 
        })
        
        socket.on('start_typing',function(data){
            io.to(data.receiver).emit('start_typing', data);
        });
        
        socket.on('stop_typing',function(data){
            io.to(data.receiver).emit('stop_typing', data);
        });
        
        socket.on('start_typing',function(data){
            io.emit('start_typing', data);
        });
        
        socket.on('stop_typing',function(data){
            io.emit('stop_typing', data);
        });

        
    });
}
