// Load required packages
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../controllers/Users');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload.id, function (err, user) {
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

function JwtAuth(req, res, callback) {
    const $ = passport.authenticate('jwt', { session: false}, function(error, user, info) {
        if (error) {
            var err = new Error('Error in authentication process');
            err.status = 500;
            return callback(err);
        }

        if (!user) {
            var err = new Error('Authentication failed,: ' + info);
            err.status = 401;
            return callback(err);
        }

        req.user = user;
        return callback();
    });

    $(req, null, callback);
}


module.exports = {
    JwtAuth
};