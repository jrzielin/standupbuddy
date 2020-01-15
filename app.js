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
const authenticationController = require('./controllers/authentication');
const teamController = require('./controllers/teams');
const itemController = require('./controllers/items');
const userController = require('./controllers/users');
const passport = require('passport');

app.use(helmet());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* Authentication */
app.post('/api/login', authenticationController.login);
app.post('/api/register', authenticationController.register);

/* Teams */
app.get('/api/teams', passport.authenticate('jwt', {session: false}), teamController.getTeams);
app.post('/api/teams', passport.authenticate('jwt', {session: false}), teamController.createTeam);
app.get('/api/teams/:teamId', passport.authenticate('jwt', {session: false}), teamController.getTeam);
app.put('/api/teams/:teamId', passport.authenticate('jwt', {session: false}), teamController.updateTeam);
app.delete('/api/teams/:teamId', passport.authenticate('jwt', {session: false}), teamController.deleteTeam);

/* Items */
app.get('/api/items', passport.authenticate('jwt', {session: false}), itemController.getItems);
app.post('/api/items', passport.authenticate('jwt', {session: false}), itemController.createItem);
app.get('/api/items/:itemId', passport.authenticate('jwt', {session: false}), itemController.getItem);
app.put('/api/items/:itemId', passport.authenticate('jwt', {session: false}), itemController.updateItem);
app.delete('/api/items/:itemId', passport.authenticate('jwt', {session: false}), itemController.deleteItem);

/* Users */
app.get('/api/users', passport.authenticate('jwt', {session: false}), userController.getUsers);
app.get('/api/users/:userId', passport.authenticate('jwt', {session: false}), userController.getUser);

/* Render React Front End */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));