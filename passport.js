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
        db
        .select(['id', 'email', 'password', 'first_name', 'last_name', 'created_at'])
        .from('users')
        .where({email})
        .then(data => {
            if(data.length) {
                data = data[0];
                bcrypt.compare(password, data.password)
                .then(res => {
                    if(res === true) {
                        const user = {
                            id: data.id,
                            email: data.email,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            created_at: data.created_at
                        };
                        return cb(null, user, {message: 'Logged In Successfully'});
                    }
                    else {
                        return cb(null, false, {error: 'Incorrect email or password'});
                    }
                })
                .catch(error => cb(error));
            }
            else {
                return cb(null, false, {error: 'Unable to authenticate'});
            }
        })
        .catch(err => cb(null, false, {error: 'Unable to authenticate'}));
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
            last_name: jwtPayload.last_name,
            created_at: jwtPayload.created_at
        };

        return cb(null, user);
    }
));