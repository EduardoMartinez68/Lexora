const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'plus_erp',
  password: 'bobesponja48',
  port: 5432
});

module.exports = db;