const db = require('../db/db').db;
const moment = require('moment');

getItems = (req, res) => {
    const userId = req.user.id;
    
    db.any('SELECT id, title, description, item_date, completed, user_id, created_at, team_id FROM items WHERE user_id = $1 ORDER BY item_date', userId)
    .then(items => res.status(200).json({items: items}))
    .catch(err => res.status(500).json({error: 'Unable to query items'}));
}

createItem = (req, res) => {
    const userId = req.user.id;
    const title = req.body.title || "";
    const description = req.body.description || "";
    const itemDate = req.body.item_date;
    const teamId = req.body.team_id || null;

    if(!title) return createError(res, 'Must supply a name.');
    if(!itemDate) return createError(res, 'Must supply an item date.');
    if(!moment(itemDate, 'YYYY-MM-DDTHH:mm:ssZ').isValid()) return createError('Invalid format for item date.');

    db.one('INSERT INTO items (user_id, title, description, item_date, team_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, title, description, item_date, completed, created_at, team_id', [userId, title, description, itemDate, teamId])
    .then(item => res.status(200).json({item: item}))
    .catch(err => res.status(500).json({error: 'Unable to create item.'}));
}

getItem = (req, res) => {
    const userId = req.user.id;
    const itemId = parseInt(req.params.itemId) || null;

    if(!itemId) return missingItemIdResponse(res);

    db.one('SELECT id, title, description, item_date, completed, user_id, created_at, team_id FROM items WHERE id = $1 AND user_id = $2', [itemId, userId])
    .then(item => res.status(200).json({item: item}))
    .catch(err => res.status(500).json({error: 'Unable to get item.'}));
}

updateItem = (req, res) => {
    const itemId = parseInt(req.params.itemId) || null;
    const userId = null;
    const title = req.body.title || "";
    const description = req.body.description || "";
    const completed = req.body.completed || false;
    const teamId = req.body.team_id || null;

    if(!itemId) return missingItemIdResponse(res);

    res.status(200).json({
        id: itemId,
        user_id: userId,
        title: title,
        description: description,
        completed: completed,
        team_id: teamId
    });
}

deleteItem = (req, res) => {
    const itemId = parseInt(req.params.itemId) || null;

    if(!itemId) return missingItemIdResponse(res);

    res.status(200).json({
        message: 'Item deleted successfully'
    });
}

missingItemIdResponse = (res) => {
    res.status(400).json({
        error: 'Must supply an item id.'
    });
}

createError = (res, message) => {
    res.status(400).json({
        error: message
    });
}

module.exports = {
    getItems: getItems,
    createItem: createItem,
    getItem: getItem,
    updateItem: updateItem,
    deleteItem: deleteItem
};