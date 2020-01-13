const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db/db').db;
const bcrypt = require('bcrypt');
const passportJWT = require('passport-jwt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
        db.one('SELECT id, email, password, first_name, last_name FROM users WHERE email = $1', email)
        .then(data => {
            bcrypt.compare(password, data.password)
            .then(res => {
                if(res === true) {
                    const user = {
                        id: data.id,
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name
                    };
                    return cb(null, user, {message: 'Logged In Successfully'});
                }
                else {
                    return cb(null, false, {error: 'Incorrect email or password'});
                }
            })
            .catch(error => {
                return cb(error);
            });
        })
        .catch(error => {
            return cb(null, false, {error: 'Unable to authenticate'});
        });
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.SECRET_KEY
    },
    function (jwtPayload, cb) {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        const user = {
            id: jwtPayload.id,
            email: jwtPayload.email,
            first_name: jwtPayload.first_name,
            last_name: jwtPayload.last_name
        };

        return cb(null, user);
    }
));