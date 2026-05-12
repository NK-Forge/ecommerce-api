const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const databaseUrl = new URL(connectionString);

console.log('Database host:', databaseUrl.hostname);
console.log('Database name:', databaseUrl.pathname);

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};