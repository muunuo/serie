/* 
Done:
1. Registering a new user into a database
2. Users being able to acess a landing page
3. Users having to log inn to access said landing page 
4. each landing page being uniqe to a user (use nickname to test)

No longer doing
5. Show BRANCH: show alle shows
6. Show BRANCH: user able to register new shows

Working on:
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

const pool = mysql.createPool({ // used do to maria.db being used
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root', //later: put in an env file for safty
  database: 'serie',
  connectionLimit: 5,
  multipleStatements: true,
});

// const password = process.env.PASSWORD; //password is saved in a different file do to safty 

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

//if the database dose not exist. Create it ⤵
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
  session({ //to avoid having id in the url for safty and readability
    secret: "secretKey", //incrypt the session-ID (move to an env file for safty)
    resave: false, // Won't save a unchanged session (to avoid unaceserry saves)
    saveUninitialized: false, // Won't save a empty session
    cookie: {
      secure: false, // using http whitch is not secure, and therfor is this sett to false. Change to 'true' if using https
      maxAge: 1000 * 60 * 60 // session expier after 1 houre 
    },
  })
);

/* 
-------------------------------
    DATABASE
-------------------------------
*/

/* ----------
    Paths settup
---------- */

function requireLogin_(req, res, next) { //user must be logd in and have a session
  if (!req.session.sessionUser_) {//if user dosn't have a session
    return res.redirect("/"); //redirect to /index.html
  }
  next(); //if they are logd in, then let them continue
}

//everything under /private requires user to be logd in ⤵
app.use('/private', requireLogin_, express.static(path.join(__dirname, "private"))); 


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); //sets where / takes user
}); 

/* ----------
    User creation and log in
---------- */
app.post('/createUser_', async (req, res) => { //adds new users to database
  const { username_, password_, nickname_ } = req.body; //get the username, password and nickname from the form in index.html

  const [rows_] = await pool.query('SELECT * FROM bruker WHERE brukernavn = ?', [username_]); //rows_ checks if the username is taken or free. the [] is because it is checking multiple rows. (maria.db exlusiv)
  if (rows_.length > 0) { //check if username is taken (if more then 0)
    return res.status(400).json({ message: "A user with this username alredy exist. Please select a different username"}); //stops a different user from picking it
  }

  try {
    const saltRounds_ = 10; //inrypts the password using saltrounds
    const hashPassword_ = await bcrypt.hash(password_, saltRounds_); //the hashPassword is the password that gets saved to the db
    const [stmt_] = await pool.execute( //cheking multiple rows, so use []. (Query = get, execute = do)
      'INSERT INTO bruker (brukernavn, passord, kallenavn) VALUES (?, ?, ?)', 
      [username_, hashPassword_, nickname_] // Mariadb uses [varible] insted of run/get to send querys to/from database 
    );
    res.status(201).json({ message: "New user added", id: stmt_.insertId }); //lets user know they where added sucsesfully
  } catch (error){ //if an error happens
    console.log(error);
    res.status(500).json({message: "There was a problem with loging in. Please try again."}); //informs user of error
  }
});

app.post('/login_', async (req, res) => { //users woth an account can log in
  const {inUsername_, inPassword_} = req.body; // retrieves what user puts in form 

  const [users_] = await pool.query('SELECT * FROM bruker WHERE brukernavn = ?', [inUsername_]); // checks if there is a matching username
  if (users_.length === 0) { // if there is not then user cant log in
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const user_ = users_[0]; //gets first user object (turns an array into an object)
  const passwordMatch_ = await bcrypt.compare(inPassword_, user_.passord) //checks if the password matches the incrypted password
if (!passwordMatch_) { //if they dont match, user can't log in
    return res.status(401).json({ message: "Invalid username or password" });
  }
  req.session.sessionUser_ = { //if they do, get info for session
  username_ : user_.brukernavn,
  nickname_ : user_.kallenavn,
  userId_ : user_.bruker_id
};
  return res.redirect(`/private/dashboard.html`); //send user to dashboard.html when logd in
});

app.get('/api/user_', async (req, res) => { //example of a simple route where all users are shown
  try {
    const [rows] = await pool.query('SELECT * FROM bruker'); 
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch data from serie_database_1.serie' });
  }
}); // search http://localhost:3000/user to see the info

app.delete('/api/deleteUser_', async (req, res) => { //user able to deleate account
  if (!req.session.sessionUser_) {
    return res.status(401).json({ message: "Not logged in" });
  }
  const userId_ = req.session.sessionUser_.userId_;
  try {
    const [delete_] = await pool.execute('DELETE FROM bruker WHERE bruker_id = ?', [userId_]);
    req.session.destroy();
    res.json({ message: "User was successfully deleted :)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "deletion faild. Try again"})
  }
});

/*
-------------------------------
    SHOWS
-------------------------------
*/

app.post('/api/registerShowDB_', async (req, res)=> { //registers a series to the database using id
  
  const {seriesId_} = req.body; //info is gotten from the search.js file and sent here
  try {
    //sends the id gotten in serch.js to the database⤵
    const [seriesIdRes_] = await pool.execute('INSERT INTO status_serie (serie_id, status) VALUES (?, ?)', [seriesId_]); 
    res.json({ message: 'Show registered', id: seriesIdRes_.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
-------------------------------
    Series status
-------------------------------
*/

app.get('/api/checkSeriesStaus_', async (req, res) => { //checks show status (watching, watchd, watch) on different user accounts
  const userSession_ = req.session.sessionUser_.userId_; // req.session.sessionUser_.userId_; //gets id from session
    try {
    const [checkStatus_] = await pool.query( 
      //get id from series and check up against status_series to see the status each user has given a show.⤵
      `SELECT serie.*, status_serie.status 
      FROM serie 
      INNER JOIN status_serie 
      ON serie.serie_id = status_serie.serie_id 
      WHERE status_serie.bruker_id = ?`, 
      [userSession_]); //the id is sat by the session
    res.json(checkStatus_);
  } catch (err) {
    console.error('Database error:', err); //if it fails, send an error
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


/*
-------------------------------
    SEND INFO TO FRONTEND
-------------------------------
*/

app.get('/api/sessionUser', (req, res) => { //sends username to frontend (user.js)
  if (req.session.sessionUser_) { //gets username from session
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

app.listen(port, () => { //starts up the server and says where to find it
  console.log(`website running at http://localhost:${port}`);
});
