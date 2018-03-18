module.exports = function(io, CountryRoom, _) {
    const users = new CountryRoom();

    io.on('connection', (socket) => {
        socket.on('join country', (params, callback) => {
            socket.join(params.room);
            
            users.AddUserData(socket.id, params.sender.username, params.room);
            io.to(params.room).emit('roomList', users.GetUsersList(params.room));
            
            callback();
        });
        
        socket.on('roomMessage', (message) => {
            io.to(message.room).emit('newRoomMessage', {
                text: message.text,
                room: message.room,
                from: message.sender
            });
        });
        
        
        socket.on('disconnect', () => {
            const user = users.RemoveUser(socket.id);
            if(user){
                const userData = users.GetUsersList(user.room);
                io.to(user.room).emit('roomList', userData);
            }
        })

        
    });
}
