const db = require('../db/db').db;
const moment = require('moment');

getItems = (req, res) => {
    const userId = req.user.id;
    const team_id = req.query.team_id;
    let params = {
        user_id: userId
    };

    if(team_id != undefined) {
        params['team_id'] = parseInt(team_id) || null;
    };

    if(req.query.item_date) {
        const ceilingDate = moment(req.query.item_date, 'YYYY-MM-DDTHH:mm:ssZ');
        const temp = ceilingDate.clone();

        if(!ceilingDate.isValid()) {
            return response.status(400).json({error: 'Invalid item_date format. Format needs to be YYYY-MM-DDTHH:mm:ssZ.'});
        }

        const floorDate = temp.subtract(2, 'days');

        db.select(['id', 'title', 'description', 'item_date', 'completed', 'user_id', 'created_at', 'team_id'])
        .from('items')
        .where(params)
        .whereBetween('item_date', [floorDate.utc().format(), ceilingDate.utc().format()])
        .orderBy('item_date')
        .then(items => res.status(200).json({items: items}))
        .catch(err => res.status(500).json({error: 'Unable to get items'}));
    }
    else {
        let page = parseInt(req.query.page) || 1;
        let page_size = parseInt(req.query.page_size) || 10;
        const search = req.query.search || '';

        if(page < 1) page = 1;
        if(page_size > 100) page_size = 100;
        
        const offset = (page - 1) * page_size;

        db.select(['id', 'title', 'description', 'item_date', 'completed', 'user_id', 'created_at', 'team_id'])
        .from('items')
        .where(params)
        .where('title', 'ilike', '%' + search + '%')
        .orderBy('item_date')
        .limit(page_size)
        .offset(offset)
        .then(items => res.status(200).json({items: items}))
        .catch(err => res.status(500).json({error: 'Unable to get items'}));
    }
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

    db('items').insert({title: title, description: description, item_date: itemDate, user_id: userId, team_id: teamId})
    .returning(['id', 'title', 'description', 'item_date', 'completed', 'user_id', 'created_at', 'team_id'])
    .then(item => res.status(200).json({item: item[0]}))
    .catch(err => res.status(500).json({error: 'Unable to create item.'}));
}

getItem = (req, res) => {
    const itemId = parseInt(req.params.itemId) || null;

    if(!itemId) return missingItemIdResponse(res);

    db.select(['id', 'title', 'description', 'item_date', 'completed', 'user_id', 'created_at', 'team_id'])
    .from('items')
    .where({
        id: itemId,
    })
    .then(item => item.length ? res.status(200).json({item: item[0]}) : res.status(404).json({error: 'Item not found'}))
    .catch(err => res.status(500).json({error: 'Unable to get item'}));
}

updateItem = (req, res) => {
    const itemId = parseInt(req.params.itemId) || null;
    const userId = req.user.id;
    const title = req.body.title;
    const description = req.body.description;
    const completed = req.body.completed;
    const teamId = parseInt(req.body.team_id);

    if(!itemId) return missingItemIdResponse(res);

    let params = {};
    if(title) params['title'] = title;
    if(description) params['description'] = description;
    if(completed) params['completed'] = completed;
    if(teamId) params['team_id'] = teamId;

    db('items')
    .where({id: itemId, user_id: userId})
    .update(params)
    .returning(['id', 'title', 'description', 'item_date', 'completed', 'user_id', 'created_at', 'team_id'])
    .then(item => {
        if(item.length) {
            item = item[0];
            item.user_id == userId ? res.status(200).json({item: item}) : res.status(403).json({error: 'Unauthorized to update item'});
        }
        else {
            res.status(404).json({error: 'Item not found'});
        }
    })
    .catch(err => res.status(500).json({error: 'Unable to update item.'}));
}

deleteItem = (req, res) => {
    const itemId = parseInt(req.params.itemId) || null;
    const userId = req.user.id;

    if(!itemId) return missingItemIdResponse(res);

    db
    .select(['id', 'user_id'])
    .from('items')
    .where({id: itemId})
    .then(item => {
        if(item.length) {
            item = item[0];
            if(item.user_id == userId) {
                db('items')
                .where({id: itemId})
                .del()
                .then(count => res.status(200).json({message: 'Item deleted successfully'}))
                .catch(err => res.status(500).json({error: 'Unable to delete item'}));
            }
            else {
                res.status(403).json({error: 'Unauthorized to delete item'});
            }
        }
        else {
            res.status(404).json({error: 'Item not found'});
        }
    })
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