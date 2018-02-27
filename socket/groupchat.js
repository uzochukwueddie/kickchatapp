module.exports = function(io, User, _) {
    const users = new User();

    let userId;

    io.on('connection', (socket) => {
        socket.on('join', (params, callback) => {
            socket.join(params.room);
            users.AddUserData(socket.id, params.sender.username, params.room);
            io.to(params.room).emit('usersList', users.GetUsersList(params.room));
            
            socket.join(params.sender.username)
            
            callback();
        });

        socket.on('createMessage', (message) => {
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender
            });
        });
        
        socket.on('request', (friend) => {
            io.to(friend.receiver).emit('newFriend', {
               from: friend.sender,
               to: friend.receiver
            }); 
        });
        
        socket.on('refresh', (friend) => {
            io.emit('refreshPage', {}); 
        });

        

        socket.on('disconnect', () => {
            const user = users.RemoveUser(socket.id);
            if(user){
                const userData = users.GetUsersList(user.room);
                io.to(user.room).emit('usersList', userData);
            }
        })
    });
}
