const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./users.db');

const user = {
  first_name: 'Vansh',
  last_name: 'Angra',
  email: 'vanshangra@gmail.com',
  password: '12345'
};

async function insertUser() {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const query = `
    INSERT OR IGNORE INTO users (first_name, last_name, email, password)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [user.first_name, user.last_name, user.email, hashedPassword], function(err) {
    if (err) {
      console.error('Error inserting user:', err.message);
    } else {
      console.log('User inserted successfully!');
    }
    db.close();
  });
}

insertUser();
