/* 
Done:
1. Registering a new user into a database
2. Users being able to acess a landing page
3. Users having to log inn to access said landing page 
4. each landing page being uniqe to a user (use nickname to test)

Working on:
SE OVER KODEN: du hadde problemer med merging forige gang, og det var derfor noe feilkode som snek seg inn. 
Se på dette første ting neste gang 

5. Show BRANCH: show alle shows
6. Show BRANCH: user able to register new shows
7. User BRANCH: user able to assign status to shows
8. User BRANCH: user able to see shows they register on their landing page
9. rec BRANCH: user able to send recomondations
10. rec BRANCH: user able to recive recomondations
*/

const express = require('express');
const mysql = require('mysql2/promise'); // needed do to using mariadb, download using 'mysql2'
const bcrypt = require('bcrypt'); //to be able to protect passwords
const session = require('express-session');
const app = express();
const port = 3000; // What port is in use
// require('dotenv').config();

// const password = process.env.PASSWORD; //password is saved in a different file do to safty 

const pool = mysql.createPool({ // is needed do to me using mariadb
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'serie',
  connectionLimit: 5,
  multipleStatements: true,
});

// app.get('/api/bearertoken', (req, res) => {
//   res.json({ token: process.env.BEARERTOKEN });
// });

/*
-------------------------------
    MIDDLEWARE
-------------------------------
*/

app.use(express.static('public')); //Middleware to serv static files from public
app.use(express.json()); //middleware for parse JSON from request body
app.use(express.urlencoded({extended: true})); //DO NOT REMOVE!!! allows you to get info from the search bar

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
    },
  })
);

/* 
-------------------------------
    DATABASE
-------------------------------
*/

function requireLogin_(req, res, next) {
  if (!req.session.sessionUser_) {
    return res.redirect("/");
  }
  next();
}

app.use('/private', requireLogin_, express.static(path.join(__dirname, "private")));

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
  
  console.log(req.body);
  const { username_, password_, nickname_ } = req.body;

  const [rows_] = await pool.query('SELECT * FROM bruker WHERE brukernavn = ?', [username_]); //rows_ checks if the username is taken or free. the [] is because it is checking multiple rows. (maria.db exlusiv)
  if (rows_.length > 0) {
    return res.status(400).json({ message: "A user with this username alredy exist. Please select a different username"});
  }

  try {
    const saltRounds_ = 10;
    const hashPassword_ = await bcrypt.hash(password_, saltRounds_);
    const [stmt_] = await pool.execute( //it is again using multiple rows, so it uses []. (Use Query or execute--?)
      'INSERT INTO bruker (brukernavn, passord, kallenavn) VALUES (?, ?, ?)', 
      [username_, hashPassword_, nickname_] // insted of run and get you just use a comma and [] to send quarys to the database. 
    );
    res.status(201).json({ message: "New user added", id: stmt_.insertId });

  } catch (error){
    console.log(error);
    res.status(500).json({message: "There was a problem with loging in. Please try again."});
  }
});

app.post('/login_', async (req, res) => {
  const {inUsername_, inPassword_} = req.body; // retrieves what user puts in form 

  const [users_] = await pool.query('SELECT * FROM bruker WHERE brukernavn = ?', [inUsername_]); // checks if there is a matching username
  if (users_.length === 0) { // if there is not then user gets an invalid
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const user_ = users_[0]; //to avoid having to write [0] evry time (checks if empty)
  const passwordMatch_ = await bcrypt.compare(inPassword_, user_.passord) //
if (!passwordMatch_) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  req.session.sessionUser_ = {
  username_ : user_.brukernavn,
  nickname_ : user_.kallenavn
};
  return res.redirect(`/private/dashboard.html`);

});
// //successful login

/*
-------------------------------
    SHOWS
-------------------------------
*/

app.post('/api/registerShowDB_', async (req, res)=> { // oppretter en serie
  
  const { showId_ } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO serie (serie_id) VALUES (?)', [showId_]);
    res.json({ message: 'Show registered', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.post('/createShow', (req, res)=> { // oppretter en serie
//     const { serieNavn, serieBio, seriePlakat } = req.body;

//     try {
//         console.log(serieNavn, serieBio, seriePlakat)
//         const insert = db.prepare('INSERT INTO serie (navn, bio, plakat) VALUES (?, ?, ?)');
//         insert.run(serieNavn, serieBio, seriePlakat);
//     } catch (error) {
//         console.log(error);
//         res.send("serie ved opprettelse"); //sender meldingen om catch eller try blir trigget
//     }
// });

/*
-------------------------------
    SEND INFO TO FRONTEND
-------------------------------
*/

app.get('/api/sessionUser', (req, res) => {
  if (req.session.sessionUser_) {
    res.json(req.session.sessionUser_);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

/*
-------------------------------
    PORT
-------------------------------
*/

app.listen(port, () => {
  console.log(`website running at http://localhost:${port}`);
});
