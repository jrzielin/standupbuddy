const db = require('../db/db').db;

getUsers = (req, res) => {
    db
    .select(['id', 'first_name', 'last_name', 'created_at'])
    .from('users')
    .orderBy(['first_name', 'last_name'])
    .then(users => res.status(200).json({users: users}))
    .catch(err => res.status(500).json({error: 'Unable to get users'}));
}

getUser = (req, res) => {
    const id = req.params.userId;

    db
    .select(['id', 'first_name', 'last_name', 'created_at'])
    .from('users')
    .where({id})
    .then(user => user.length ? res.status(200).json({user: user[0]}) : res.status(404).json({error: 'User not found'}))
    .catch(err => res.status(500).json({error: 'Unable to get user'}));
}

module.exports = {
    getUsers: getUsers,
    getUser: getUser
};