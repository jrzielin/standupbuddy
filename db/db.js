const pgp = require('pg-promise')(/* options */);
const moment = require('moment');
let types = pgp.pg.types;
types.setTypeParser(1114, str => moment.utc(str).format());
const dotenv = require('dotenv');

dotenv.config();

const db = pgp(process.env.DB_CONNECTION);

module.exports = {
    db: db
};