//POSTGRESQL SETUP

const Pool = require('pg').Pool;

// Create a PostgreSQL connection pool.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, // Replace with your database server's hostname or IP address.
  database: process.env.DB_NAME, // Replace with your database name.
  password: String(process.env.DB_PASSWORD),
  port: 3001, // Replace with the correct port if you configured PostgreSQL differently.
});

// You can export the pool for use in your Express routes.
module.exports = pool;