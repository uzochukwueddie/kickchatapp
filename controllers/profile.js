const User = require('../models/user');
const Country = require('../models/countries');




exports.getProfile = async (req, res) => {
    const profile = await User.findOne({"username": req.params.username.replace(/-/g, ' ')}, {"password":0})
                            .populate('request.senderId')
                            .populate('friends.friendId')
    
    return res.status(200).json({message: 'User Profile', profile: profile});
}

exports.addProfile = async (req, res) => {
    const data = req.body.name !== undefined || req.body.country !== undefined || req.body.mantra !== undefined 
    || req.body.club !== undefined || req.body.gender !== undefined
    
    
    if(data){
        const profile = await User.update({
            "username": req.params.username.replace(/-/g, ' ')
        }, {
            "fullname": req.body.name,
            "country": req.body.country,
            "mantra": req.body.mantra,
            "club": req.body.club,
            "gender": req.body.gender
        });
    }
    
    if(data){
        return res.status(200).json({message: 'Profile Updated'})  
    }
    
}

exports.addInterest = async (req, res) => {    
    if(req.body.clubs !== undefined){
        await User.update({
            "username": req.params.username.replace(/-/g, ' '),
            'favClub': {$ne: req.body.clubs}
        }, {
            $addToSet: { "favClub": { $each: req.body.clubs } },
        }); 
    }
    
    if(req.body.players !== undefined){
        await User.update({
            "username": req.params.username.replace(/-/g, ' '),
            'favPlayers': {$ne: req.body.players}
        }, {
            $push: { "favPlayers": req.body.players },
        });    
    }
    
    if(req.body.players !== undefined || req.body.teams !== undefined){
        return res.status(200).json({message: 'Interests Updated'});
    } else {
        return res.status(200).json({
            err: 'Empty Fileds Submitted'});
    }
    
}

exports.deleteValues = async (req, res) => {    
    if(req.body.playername !== undefined){
        await User.update({
            "username": req.body.playerUser
        }, {
            $pull: { "favPlayers": req.body.playername },
        }); 
        
        return res.status(200).json({deleteMsg: `${req.body.playername} has been deleted`});
    }
    
}

exports.deleteTeam = async (req, res) => {    
    if(req.body.teamname !== undefined){
        await User.update({
            "username": req.body.teamUser
        }, {
            $pull: { "favTeams": req.body.teamname },
        });
        
        await Country.update({
            "name": req.body.teamname
        }, {
            $pull: { "fans": {
                username: req.body.teamUser 
            }},
        });
        
        return res.status(200).json({deleteMsg: `${req.body.teamname} has been deleted`});
    }
    
}

exports.changePassword = async (req, res) => {
    if(req.body.password.length < 5){
        return res.status(200).json({error: 'Password must not be less than 5 characters.'});
    }
    
    if(req.body.cpassword.length < 5){
        return res.status(200).json({error: 'Confirm password must not be less than 5 characters.'});
    }
    
    if(req.body.password !== req.body.cpassword){
        return res.status(200).json({error: 'Password and confirm password must be equal.'});
    }else {
        const pass = await User.update({
            "username": req.body.username
        }, {
            password: User.encryptPassword(req.body.password)
        }); 
        
        return res.status(200).json({message: 'Password has been updated successfully'});
        
    }
}












