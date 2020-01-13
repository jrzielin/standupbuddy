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
    const password = req.body.password || "";
    const first_name = req.body.first_name || "";
    const last_name = req.body.last_name || "";

    db.one('SELECT COUNT(*) FROM users WHERE email = $1', email)
    .then(data => {
        if(data.count > 0) {
            return res.json({error: 'User with that email already exists'});
        }

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                return res.json({error: 'Error creating password hash'});
            }

            db.one('INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at', [email, hash, first_name, last_name])
            .then(user => {
                req.login(user, {session: false}, (err) => {
                    if(err) {
                        res.send(err);
                    }
        
                    const token = jwt.sign(user, process.env.SECRET_KEY);
                    return res.json({user, token});
                });
            })
            .catch(error => {
                return res.json({error: 'Unable to create new user'});
            });
        });
    })
    .catch(error => {
        return res({error: 'Unable to create new user'});
    });
}

module.exports = {
    login: login,
    register: register
};