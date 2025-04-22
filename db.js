const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite DB (creates file if not exists)
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error('Database opening error: ', err);
  else console.log("Connected to SQLite database.");
});

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

module.exports = db;
