const db = require("../db");

async function findById(id) {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
}

async function createUser({ username, firstName, lastName, email, passwordHash }) {
  const { rows } = await db.query(
    `
    INSERT INTO users (username, first_name, last_name, email, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, first_name, last_name, email, membership_status, is_admin
    `,
    [username, firstName, lastName, email, passwordHash]
  );

  return rows[0];
}

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  createUser,
};