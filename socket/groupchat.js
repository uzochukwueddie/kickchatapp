module.exports = function(io, User, _) {
    const users = new User();

    let userId;

    io.on('connection', (socket) => {
        socket.on('join', (params, callback) => {
            socket.join(params.room);
            userId = params.socketId;
            users.AddUserData(socket.id, params.sender.username, params.room);
            
            io.to(params.room).emit('usersList', users.GetUsersList(params.room));
            // io.to(params.room).emit('usersList', users)
            
            callback();
        });

        socket.on('createMessage', (message) => {
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender
            });
        });

        socket.on('mydata', (data) => {
            data.forEach(function(val){
                // console.log(val)
                io.to(val.room).emit('newUser', {
                    name: val.name,
                    room: val.room
                });
            })
            
        });

        socket.on('disconnect', () => {
            const user = users.RemoveUser(userId);
            if(user){
                //console.log(user)
                const userData = users.GetUsersList(user.room);
                io.to(user.room).emit('usersList', userData);
            }
        })
    });
}
