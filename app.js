const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const app = express();
const teamController = require('./controllers/teams');
const itemController = require('./controllers/items');

app.use(helmet());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* Teams */
app.get('/api/teams', teamController.getTeams);
app.post('/api/teams', teamController.createTeam);
app.get('/api/teams/:teamId', teamController.getTeam);
app.put('/api/teams/:teamId', teamController.updateTeam);
app.delete('/api/teams/:teamId', teamController.deleteTeam);

/* Items */
app.get('/api/items', itemController.getItems);
app.post('/api/items', itemController.createItem);
app.get('/api/items/:itemId', itemController.getItem);
app.put('/api/items/:itemId', itemController.updateItem);
app.delete('/api/items/:itemId', itemController.deleteItem);

/* Render React Front End */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));