const db = require("../db");

async function getCommentsByMessageId(messageId) {
  const { rows } = await db.query(
    `
    SELECT
      c.id,
      c.message_id,
      c.user_id,
      c.body,
      c.created_at,
      u.username,
      u.first_name,
      u.last_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.message_id = $1
    ORDER BY c.created_at ASC
    `,
    [messageId]
  );
  return rows;
}

async function createComment({ messageId, userId, body }) {
  const { rows } = await db.query(
    `
    INSERT INTO comments (message_id, user_id, body)
    VALUES ($1, $2, $3)
    RETURNING id, message_id, user_id, body, created_at
    `,
    [messageId, userId, body]
  );
  return rows[0];
}

async function deleteComment(id) {
  await db.query("DELETE FROM comments WHERE id = $1", [id]);
}

module.exports = {
  getCommentsByMessageId,
  createComment,
  deleteComment,
};