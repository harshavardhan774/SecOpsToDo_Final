const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");

// create table
db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)"
);

// signup
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // vulnerable query (SQL Injection possible)
    const query = `INSERT INTO users (username,password) VALUES ('${username}','${password}')`;

    db.run(query, (err) => {
        if (err) {
            res.send("Error creating user");
        } else {
            res.send("User created. Go to login page.");
        }
    });
});

// login
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // vulnerable query
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    db.get(query, (err, row) => {
        if (row) {
            res.sendFile(__dirname + "/public/dashboard.html");
        } else {
            res.send("Invalid credentials");
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});