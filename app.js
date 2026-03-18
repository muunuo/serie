const express = require('express');
const mysql = require('mysql2/promise'); // trengs grunnet bruk av Maria.db. Lastes ned som mysql2
const app = express();
const port = 3000; // Hvilken port det åpned 

const pool = mysql.createPool({ // trengs grunnet bruk av Maria.db.
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'serie',
  connectionLimit: 5,
  multipleStatements: true //tillater flere statments samtidig (ai)
});

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

app.get('/', (req, res) => {
    res.send('Hello World!');
}); 

app.get('/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM serie');
    console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch data from serie_database_1.serie' });
  }
});

app.listen(port, () => {
  console.log(`website running at http://localhost:${port}`);
});