getTeams = (req, res) => {
    res.status(200).json({
        teams: [{
            id: 1,
            name: 'Standup Buddy'
        }]
    });
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