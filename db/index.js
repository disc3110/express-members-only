const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

const pool = new Pool({
  connectionString,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};