const db = require('../db/db').db;

getTeams = (req, res) => {
    const user_id = req.user.id;
    const mine = req.query.mine || 'false';

    if(mine == 'true') {
        db.select(['id', 'name', 'owner_id', 'created_at'])
        .from('teams')
        .where({owner_id: user_id})
        .orderBy('name')
        .then(teams => res.status(200).json({teams: teams}))
        .catch(err => res.status(500).json({error: 'Unable to query teams'}));
    }
    else {
        let page = parseInt(req.query.page) || 1;
        let page_size = parseInt(req.query.page_size) || 10;
        const search = req.query.search || '';

        if(page < 1) page = 1;
        if(page_size > 100) page_size = 100;
        
        const offset = (page - 1) * page_size;

        db.select(['id', 'name', 'owner_id', 'created_at'])
        .from('teams')
        .where('name', 'ilike', '%' + search + '%')
        .orderBy('name')
        .limit(page_size)
        .offset(offset)
        .then(teams => res.status(200).json({teams: teams}))
        .catch(err => res.status(500).json({error: 'Unable to query teams'}));
    }
}

createTeam = (req, res) => {
    const owner_id = req.user.id;
    const name = req.body.name || "";

    if(!name) return createError(res, 'Must supply a name.');

    db('teams')
    .insert({name, owner_id})
    .returning(['id', 'name', 'owner_id', 'created_at'])
    .then(team => res.status(201).json({team: team[0]}))
    .catch(err => res.status(500).json({error: 'Unable to create team'}));
}

getTeam = (req, res) => {
    const teamId = parseInt(req.params.teamId) || null;

    if(!teamId) return missingTeamIdResponse(res);

    db.select(['id', 'name', 'owner_id', 'created_at'])
    .from('teams')
    .where({id: teamId})
    .then(team => team.length ? res.status(200).json({team: team[0]}): res.status(404).json({error: 'Team not found'}))
    .catch(err => res.status(500).json({error: 'Unable to get team'}));
}

updateTeam = (req, res) => {
    const id = parseInt(req.params.teamId) || null;
    const user_id = req.user.id;
    const name = req.body.name || "";
    const owner_id = req.body.owner_id || null;

    if(!id) return missingTeamIdResponse(res);

    let params = {};
    if(owner_id) params['owner_id'] = owner_id;
    if(name) params['name'] = name;

    db
    .select(['id', 'name', 'owner_id'])
    .from('teams')
    .where({id})
    .then(team => {
        if(team.length) {
            team = team[0];
            if(team.owner_id == user_id) {
                db('teams')
                .where({id})
                .update(params)
                .returning(['id', 'name', 'owner_id', 'created_at'])
                .then(team => res.status(200).json({team: team[0]}))
                .catch(err => res.status(500).json({error: 'Unable to update team'}));
            }
            else {
                res.status(403).json({error: 'Unauthorized to update team'});
            }
        }
        else {
            res.status(404).json({error: "Team not found"});
        }
    })
    .catch(err => res.status(500).json({error: 'Unable to update team'}));
}

deleteTeam = (req, res) => {
    const id = parseInt(req.params.teamId) || null;
    const user_id = req.user.id;

    if(!id) return missingTeamIdResponse(res);

    db
    .select(['id', 'name', 'owner_id'])
    .from('teams')
    .where({id})
    .then(team => {
        if(team.length) {
            team = team[0];
            if(team.owner_id == user_id) {
                db('teams')
                .where({id})
                .del()
                .then(count => res.status(200).json({message: 'Team deleted successfully'}))
                .catch(err => res.status(500).json({error: 'Unable to delete team'}));
            }
            else {
                res.status(403).json({error: 'Unauthorized to delete team'});
            }
        }
        else {
            res.status(404).json({error: "Team not found"});
        }
    })
    .catch(err => res.status(500).json({error: 'Unable to update team'}));
}

missingTeamIdResponse = (res) => {
    res.status(400).json({
        error: 'Must supply a team id.'
    });
}

createError = (res, message) => {
    res.status(400).json({
        error: message
    });
}

module.exports = {
    getTeams: getTeams,
    createTeam: createTeam,
    getTeam: getTeam,
    updateTeam: updateTeam,
    deleteTeam: deleteTeam
};