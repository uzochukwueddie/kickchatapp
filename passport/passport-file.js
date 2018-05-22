const passport    = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const User = require('../models/user');


passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
 
    User.findOne({"email": email}, function(err, user){

        if(err){
            return done(err);
        }
        
        if(!user || !user.compareUserPassword(password)){
            return done(null, false, 'Email Does Not Exist or Password is Invalid');
        }
        
        return done(null, user);

    });

}))

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.JSON_SECRET
    },
    function (jwt_payload, done) {
    
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
    }
));