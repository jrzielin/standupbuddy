getItems = (req, res) => {
    const userId = 1;
    const title = "Did a thing";
    const description = "It was hard.";
    const itemDate = null;
    const completed = false;
    const teamId = null;

    res.status(200).json({
        items: [{
            id: 2,
            user_id: userId,
            title: title,
            description: description,
            item_date: itemDate,
            completed: completed,
            team_id: teamId
        }]
    });
}

createItem = (req, res) => {
    const userId = null;
    const title = req.body.title || "";
    const description = req.body.description || "";
    const itemDate = req.body.item_date || null;
    const completed = req.body.completed || false;
    const teamId = req.body.team_id || null;

    if(!title) return createError(res, 'Must supply a name.');
    if(!itemDate) return createError(res, 'Must supply an item date.');

    res.status(201).json({
        team: {
            id: 2,
            user_id: userId,
            title: title,
            description: description,
            item_date: itemDate,
            completed: completed,
            team_id: teamId
        }
    });
}

getItem = (req, res) => {
    const itemId = parseInt(req.params.itemId) || null;
    const userId = null;

    if(!itemId) return missingItemIdResponse(res);

    res.status(200).json({
        item: {
            id: itemId,
            user_id: userId,
            title: 'Some Item',
            description: '',
            item_date: '',
            completed: false,
            team_id: null
        }
    });
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