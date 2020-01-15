const jwt = require('jsonwebtoken');
const passport = require('passport');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../db/db').db;
require('../passport');

dotenv.config();

login = (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err) {
            return res.status(500).json({
                error: 'Error while trying to login',
                info: info
            });
        }
        if(!user) {
            return res.status(400).json({
                'error': 'Incorrect user credentials'
            });
        }

        req.login(user, {session: false}, (err) => {
            if(err) {
                res.send(err);
            }

            const token = jwt.sign(user, process.env.SECRET_KEY);
            return res.json({user, token});
        });
    })(req, res);
}

register = (req, res) => {
    const email = req.body.email || "";
    let password = req.body.password || "";
    const confirm_password = req.body.confirm_password || "";
    const first_name = req.body.first_name || "";
    const last_name = req.body.last_name || "";

    if(!email) return res.status(400).json({error: 'Must supply an email'});
    if(!password) return res.status(400).json({error: 'Must supply a password'});
    if(!first_name) return res.status(400).json({error: 'Must supply a first name'});
    if(!last_name) return res.status(400).json({error: 'Must supply a last name'});
    if(password != confirm_password) return res.status(400).json({error: 'password and confirm password do not match'});

    db('users').count('*').where({email}).first()
    .then(result => {
        if(parseInt(result.count)) {
            res.status(400).json({error: 'User with that email already exists'});
        }
        else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err) {
                    return res.json({error: 'Error creating password hash'});
                }

                password = hash;

                db('users')
                .insert({email, password, first_name, last_name})
                .returning(['id', 'email', 'first_name', 'last_name', 'created_at'])
                .then(user => {
                    user = user[0]
                    req.login(user, {session: false}, (err) => {
                        if(err) {
                            res.send(err);
                        }

                        const token = jwt.sign(user, process.env.SECRET_KEY);
                        return res.json({user, token});
                    });
                })
                .catch(err => res.status(500).json({error: 'Unable to create new user'}));
            });
        }
    })
    .catch(err => res.status(500).json({error: 'Unable to count properly'}));
}

module.exports = {
    login: login,
    register: register
};