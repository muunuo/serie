/* 
Done:
1. Registering a new user into a database

Working on:
1. Hashing passwords
2. Users being able to acess a landing page
3. Users having to log inn to access said landing page 
*/

const express = require('express');
const mysql = require('mysql2/promise'); // needed do to using mariadb, download using 'mysql2'
const bcrypt = require('bcrypt'); //to be able to protect passwords
const session = require('express-session');
const app = express();
const port = 3000; // What port is in use


const pool = mysql.createPool({ // needed do to using mariadb
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'serie',
  connectionLimit: 5,
  multipleStatements: true,
});

/*
-------------------------------
    MIDDLEWARE
-------------------------------
*/

app.use(express.static('public')); //Middleware to serv static files from public
app.use(express.json()); //middleware for parse JSON from request body
// app.use(express.urlencoded({extended: true})); //allows you to get info from the search bar

const path = require('path'); //handles the file paths
// const { session } = require('inspector'); //idk where this came from??

pool.query(`
CREATE TABLE IF NOT EXISTS bruker (
    bruker_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    brukernavn TEXT UNIQUE,
    passord TEXT,
    kallenavn TEXT,
    beskrivelse TEXT,
    bilde BLOB
);

CREATE TABLE IF NOT EXISTS serie (
    serie_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    navn TEXT,
    beskrivelse TEXT,
    utgivelses_aar TEXT,
    anmeldelse TEXT,
    bilde BLOB
);

CREATE TABLE IF NOT EXISTS anbefaling (
    anbefaling_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    kommentar TEXT,
    er_godtatt INTEGER,
    serie_id INTEGER,
    mottaker_id INTEGER,
    sender_id INTEGER,
    FOREIGN KEY (serie_id) REFERENCES serie(serie_id),
    FOREIGN KEY (mottaker_id) REFERENCES bruker(bruker_id),
    FOREIGN KEY (sender_id) REFERENCES bruker(bruker_id)
);

CREATE TABLE IF NOT EXISTS status_serie (
    status_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    status TEXT,
    bruker_id INTEGER,
    serie_id INTEGER,
    FOREIGN KEY (serie_id) REFERENCES serie(serie_id),
    FOREIGN KEY (bruker_id) REFERENCES bruker(bruker_id)
);
`);

app.use(
  session({
    secret: "secretKey", //incrypt the session-ID (make sure to change)
    resave: false, // Won't save a unchanged session
    saveUninitialized: false, // Won't save a empty session
    cookie: {
      secure: false, // change to 'true' if using https
      maxAge: 1000 * 60 * 60 // session expier after 1 houre 
    }
  })
);

/* 
-------------------------------
    DATABASE
-------------------------------
*/
function requireLogin_(req, res, next) {
  if (!req.session.bruker) {
    return res.redirect("/");
  }
  next();
}

//Shows the index file from inside the public folder (remove later?)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
}); 
app.get('/user', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bruker');
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch data from serie_database_1.serie' });
  }
});

app.post('/createUser_', async (req, res) => {
  const { username_, password_, nickname_ } = req.body;

  const [rows_] = await pool.query('SELECT * FROM bruker WHERE brukernavn = ?', [username_]); //rows_ checks if the username is taken or free. the [] is because it is checking multiple rows. (maria.db exlusiv)
  if (rows_.length > 0) {
    return res.status(400).json({ message: "Brukernavn eksisterer allerede. Velg et annet brukernavn."});
  }

    try {
    const [result] = await pool.execute( //it is again using multiple rows, so it uses []. 
      'INSERT INTO bruker (brukernavn, passord, kallenavn) VALUES (?, ?, ?)', 
      [username_, password_, nickname_] // insted of run and get you just use a comma and [] to send quarys to the database. 
    );
    res.status(201).json({ message: "Konto opprettet!", id: result.insertId });
  } catch (error){
    console.log(error);
    res.status(500).json({message: "Feil med inlogging"});
  }
});

app.listen(port, () => {
  console.log(`website running at http://localhost:${port}`);
});