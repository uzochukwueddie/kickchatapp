const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.createUser = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    

    if(!username){
        return res.status(200).send({error: 'You must enter a username address'});
    }
 
    if(!email){
        return res.status(200).send({error: 'You must enter an email address'});
    }
 
    if(!password){
        return res.status(200).send({error: 'You must enter a password'});
    }

    const user = await User.find({'email': req.body.email});
    if(user.length >= 1) {
        return res.status(200).json({error: 'User with email already exist.'});
    } else {
        const newUser = new User({
            username: User.firstUpper(req.body.username),
            email: req.body.email,
            password: User.encryptPassword(req.body.password),
        });
        
        newUser.save()
            .then(result => {
                const token = jwt.sign({data: newUser}, process.env.JSON_SECRET);

                return res.status(200).json({
                    message: 'User has been created.', 
                    token: `JWT ${token}`,
                    user: result
                });
            })
            .catch(err => {
                res.status(200).json({error: err})
            })
    }
}

exports.authUser = async (req, res) => {    
    passport.authenticate('local-login', {session: false}, (err, user, info) => {
        if (err) {
            return res.status(200).json({
                error: info ? info.message : 'Login failed',
                user   : user
            });
        }
        
        if(!user || !user.compareUserPassword(req.body.password)){
            return res.status(200).json({error: 'User was not found or Password is incorrect'});
        } 
        
        if(user.compareUserPassword(req.body.password)){
            const token = jwt.sign({data: user}, process.env.JSON_SECRET);
            return res.status(200).json({
                message: "Authentication successful",
                token: `JWT ${token}`,
                user: user
            });
        }

        if(!user.compareUserPassword(req.body.password)){
            return res.status(200).json({error: 'Password is incorrect'});
        }

        
    })
    (req, res);
    
    
}



exports.protected = (req, res, next) => {
    var token = getToken(req.headers);
    if (token) {
      var decoded = jwt.verify(token, process.env.JSON_SECRET);
      User.findOne({
        username: decoded.username
      }, function(err, user) {
          if (err) throw err;
   
          if (!user) {
            return res.status(200).send({message: 'Authentication failed. User not found.'});
          } else {
            return res.status(200).json({message: 'You are authorized', user: user});
          }
      });
    } else {
      return res.status(200).send({message: 'No token provided.'});
    }
}

getToken = function (headers) {
    if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
        return parted[1];
    } else {
        return null;
    }
    } else {
    return null;
    }
};
