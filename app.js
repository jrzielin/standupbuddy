const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const helmet = require('helmet');
const app = express();

app.use(helmet());

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/teams', (req, res) => {
    return res.status(200).json({
        teams: [{
            id: 1,
            name: 'Standup Buddy'
        }]
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));