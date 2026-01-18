require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("./index");

async function seed() {
  // clean insert order: users -> messages -> comments
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM messages");
  await db.query("DELETE FROM users");

  const password = await bcrypt.hash("Password123!", 10);

  // Create 3 users (1 admin, 1 member, 1 non-member)
  const { rows: users } = await db.query(
    `
    INSERT INTO users (username, first_name, last_name, email, password_hash, membership_status, is_admin)
    VALUES
      ('admin', 'Admin', 'User', 'admin@example.com', $1, TRUE, TRUE),
      ('maria', 'Maria', 'Lopez', 'maria@example.com', $1, TRUE, FALSE),
      ('diego', 'Diego', 'Test', 'diego@example.com', $1, FALSE, FALSE)
    RETURNING id, username;
    `,
    [password]
  );

  const adminId = users.find((u) => u.username === "admin").id;
  const mariaId = users.find((u) => u.username === "maria").id;
  const diegoId = users.find((u) => u.username === "diego").id;

  // Create 2 messages
  const { rows: messages } = await db.query(
    `
    INSERT INTO messages (user_id, title, body)
    VALUES
      ($1, 'First secret post', 'This is an anonymous post to the public...'),
      ($2, 'Second secret post', 'Members will see who wrote this inside the clubhouse.')
    RETURNING id, title;
    `,
    [mariaId, diegoId]
  );

  const msg1Id = messages[0].id;
  const msg2Id = messages[1].id;

  // Create some comments
  await db.query(
    `
    INSERT INTO comments (message_id, user_id, body)
    VALUES
      ($1, $2, 'Nice post 👀'),
      ($1, $3, 'I agree!'),
      ($2, $2, 'Welcome to the club!')
    `,
    [msg1Id, adminId, mariaId]
  );

  console.log("✅ Seed complete!");
  console.log("Users:", users);
  console.log("Messages:", messages);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
  })
  .finally(async () => {
    await db.pool.end();
  });