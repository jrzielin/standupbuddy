const db = require('../db/db').db;

getTeams = (req, res) => {
    db.select(['id', 'name', 'owner_id', 'created_at'])
    .from('teams')
    .orderBy('name')
    .then(teams => res.status(200).json({teams: teams}))
    .catch(err => res.status(500).json({error: 'Unable to query teams'}));
}

createTeam = (req, res) => {
    const name = req.body.name || "";

    if(!name) return createError(res, 'Must supply a name.');

    res.status(201).json({
        team: {
            id: 2,
            name: name
        }
    });
}

getTeam = (req, res) => {
    const teamId = parseInt(req.params.teamId) || null;

    if(!teamId) return missingTeamIdResponse(res);

    res.status(200).json({
        team: {
            id: teamId,
            name: 'Some Team'
        }
    });
}

updateTeam = (req, res) => {
    const teamId = parseInt(req.params.teamId) || null;
    const name = req.body.name || "";

    if(!teamId) return missingTeamIdResponse(res);

    res.status(200).json({
        team: {
            id: teamId,
            name: name
        }
    });
}

deleteTeam = (req, res) => {
    const teamId = parseInt(req.params.teamId) || null;

    if(!teamId) {
        return missingTeamIdResponse(res);
    }

    res.status(200).json({
        message: 'Team deleted successfully'
    });
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