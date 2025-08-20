const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection (adjust host if needed)
const pool = new Pool({
  user: "postgres",
  host: "mypg", // <-- the Docker container name of Postgres
  database: "mydb",
  password: "1password",
  port: 5432,
});

// Simple login page (form)
app.get("/", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form action="/login" method="POST">
      <label>Username: <input type="text" name="name" /></label><br/>
      <label>Password: <input type="password" name="password" /></label><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login
app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND password = $2",
      [name, password]
    );
    if (result.rows.length > 0) {
      res.send("✅ Login successful, welcome " + name);
    } else {
      res.send("❌ Invalid username or password");
    }
  } catch (err) {
    console.error(err);
    res.send("Error connecting to DB");
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});




