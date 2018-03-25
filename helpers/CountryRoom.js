
class CountryRoom {
    constructor(){
        this.country = [];
    }
    
    AddUserData(id, name, room, data){
        var users = {id, name, room, data};
        this.country.push(users);
        return users;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.country = this.country.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.country.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    
    GetUsersList(room){
        var users = this.country.filter((user) => user.room === room);
        
        var namesArray = users.map((user) => {
            return {
                name: user.name,
                room: user.room,
                userdata: user.data
            }
        });
        
        return namesArray;
    }
}

module.exports = {CountryRoom};