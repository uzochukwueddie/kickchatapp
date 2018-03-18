module.exports = function(io, Global, _) {
    var global = new Global();
    

    io.on('connection', (socket) => {
        socket.on('online', (params) => {
            socket.join(params.room);
            global.EnterRoom(socket.id, params.user.user.username, params.room)
            
            io.emit('userOnline', _.uniq(global.GetRoomList(params.room)));
            

        });
        
        socket.on('refreshUser', (friend) => {
            io.emit('onlineuser', {}); 
        });
        
        socket.on('myonline', (data) => {
            io.emit('userOnline', _.uniq(global.GetRoomList(data.room)));
        })
        
        socket.on('disconnect', () => {
            const user = global.RemoveUser(socket.id);
            
            if(user){
                var userData = global.GetRoomList(user.room);
                const arr = _.uniq(userData);
                const removeData = _.remove(arr, function(n) {
                                      return n == user.name
                                    });
                io.to(user.room).emit('userOnline', arr);
            }
        })
    
    });
}
