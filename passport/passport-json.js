const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = 'thisisasecret';    

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({email: jwt_payload.data.email}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
 
        User.findOne({"email": email}, function(err, user){
     
            if(err){
                return done(err);
            }
     
            if(!user){
                return done(null, false, {message: 'Login failed. Please try again.'});
            }
     
            user.compareUserPassword(password, function(err, isMatch){
     
                if(err){
                    return done(err);
                }
     
                if(!isMatch){
                    return done(null, false, {error: 'Login failed. Please try again.'});
                }
     
                return done(null, user);
     
            });
     
        });
     
    }))
}