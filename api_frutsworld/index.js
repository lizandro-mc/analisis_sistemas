const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mysql Client Setup
let mysql = require('mysql');

let con = mysql.createConnection({
  host: keys.msqlHost,
  user: keys.msqlUser,
  password: keys.msqlPassword,
  port: keys.msqlPort,
  database: keys.msqlDatabase,
});

con.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});


// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/authors/all", async (req, res) => {
  const values = await con.query("SELECT * from authors");
  res.send(values.rows);
});


app.post("/authors", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  const author = { name: 'Craig Buckler', values: index };
  con.query('INSERT INTO authors SET ?', author, (err, res) => {
      if(err) throw err;
  
      console.log('Last insert ID:', res.insertId);
    });

    res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
