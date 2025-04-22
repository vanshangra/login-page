const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Handle login form submission
app.post('/register', async (req, res) => {
  const { 'first-name': firstName, 'last-name': lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (first_name, last_name, email, password)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [firstName, lastName, email, hashedPassword], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(400).send('User already exists or database error.');
    }

    // Redirect to dashboard on success
    return res.redirect('/dashboard.html');
  });
});

// Launch server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Handle login form
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send('Missing email or password.');
    }
  
    // Look up user by email
    const query = `SELECT * FROM users WHERE email = ?`;
  
    db.get(query, [email], async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Database error.');
      }
  
      if (!user) {
        return res.status(401).send('User not found.');
      }
  
      // Check password
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(401).send('Incorrect password.');
      }
  
      // Success - redirect to dashboard
      return res.redirect('/dashboard.html');
    });
  });
  