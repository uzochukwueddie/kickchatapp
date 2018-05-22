const User = require('../models/user');



exports.addLocation = async (req, res) => {
    
    const user = await User.update({
        _id: req.params.id
    }, {
        country: req.body.data.country_name,
        city: req.body.data.city,
        state: req.body.data.state,
        coords: {
            latitude: req.body.data.latitude,
            longitude: req.body.data.longitude
        }
    });
    
    return res.status(200).json({message: 'User Profile Updated'})
}

exports.getUsersLocation = async (req, res) => {
    const users = await User.aggregate([
      { $project : {
        password: 0            
    }},
      {$match: {"city": req.params.city.replace(/-/g, ' ')}} //use req.body.city
    ]);
    
    if(users.length > 0){
        return res.status(200).json({message: 'Nearby Users Returned', nearby: users});
    }
}

exports.getUsersLocations = async (req, res) => {
    const users = await User.find({});
    
    if(users.length > 0){
        return res.status(200).json({message: 'Nearby Users Returned', nearby: users});
    }
}