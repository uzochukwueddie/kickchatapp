
class User {
    constructor(){
        this.users = [];
    }
    
    AddUserData(id, name, room){
        var users = {id, name, room};
        this.users.push(users);
        return users;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.users.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    
    GetUsersList(room){
        var users = this.users.filter((user) => user.room === room);
        
        var namesArray = users.map((user) => {
            return {
                name: user.name,
                room: user.room
            }
        });
        
        return namesArray;
    }
}

module.exports = {User};