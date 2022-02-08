const express = require('express');
const router = express.Router();
const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({
    database: 'music-library', // name of the database
    host: 'localhost', // where the database is
    port: 5432, // the port for your database, 5432 is default for postgres
    max: 10, // how many connections(queries) we can have at one time
    idleTimeoutMillis: 30000, // 30 seconds to try to connect and then cancel the query
});
// is not required but is useful for debugging
pool.on('connect', () => {
    console.log('postgreSQL is connected!');
})
// the pool will emit an error on behalf of any idle clients, will appear in terminal 
pool.on('error',(error) =>{
    console.log('Error with postgres pool', error);
});

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357,
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // res.send(songs);
    // check SQL query text in postico first!
    let queryText = 'SELECT * FROM "songs";'
    pool.query(queryText)
    .then((result) =>{
        res.send(result.rows);
    }).catch((err) => {
        console.log('error!', queryText, err);
        res.sendStatus(500);
    })
});

router.post('/', (req, res) => {
    songs.push(req.body);
    res.sendStatus(200);
});

module.exports = router;``