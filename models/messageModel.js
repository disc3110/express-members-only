const db = require("../db");

async function createMessage({ userId, title, body }) {
  const { rows } = await db.query(
    `
    INSERT INTO messages (user_id, title, body)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, body, created_at, updated_at
    `,
    [userId, title, body]
  );

  return rows[0];
}

async function getAllMessages() {
  const { rows } = await db.query(
    `
    SELECT
      m.id,
      m.title,
      m.body,
      m.created_at,
      u.username,
      u.first_name,
      u.last_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    ORDER BY m.created_at DESC
    `
  );
  return rows;
}

async function deleteMessage(id) {
  await db.query("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage,
};