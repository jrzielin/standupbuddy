const pgp = require('pg-promise')();
const moment = require('moment');
let types = pgp.pg.types;
types.setTypeParser(1114, str => moment.utc(str).format());
const dotenv = require('dotenv');

dotenv.config();

const db = pgp(process.env.DATABASE_URL);

module.exports = {
    db: db
};