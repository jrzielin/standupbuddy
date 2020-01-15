const db = require('../db/db').db;

getUsers = (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let page_size = parseInt(req.query.page_size) || 10;
    const search = req.query.search || '';

    if(page < 1) page = 1;
    if(page_size > 100) page_size = 100;
    
    const offset = (page - 1) * page_size;

    db
    .select(['id', 'first_name', 'last_name', 'created_at'])
    .from('users')
    .where('first_name', 'ilike', '%' + search + '%')
    .orWhere('last_name', 'ilike', '%' + search + '%')
    .orderBy(['first_name', 'last_name'])
    .limit(page_size)
    .offset(offset)
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