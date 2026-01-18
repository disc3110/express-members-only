const db = require("./index");

(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("DB connected! Time:", result.rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err);
  } finally {
    db.pool.end();
  }
})();