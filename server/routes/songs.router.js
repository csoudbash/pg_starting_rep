const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const pool = require('../modules/pool');
// const pg = require('pg');
// const Pool = pg.Pool;

// const pool = new Pool({
//     database: 'music-library', // name of the database
//     host: 'localhost', // where the database is
//     port: 5432, // the port for your database, 5432 is default for postgres
//     max: 10, // how many connections(queries) we can have at one time
//     idleTimeoutMillis: 30000, // 30 seconds to try to connect and then cancel the query
// });
// is not required but is useful for debugging
// pool.on('connect', () => {
//     console.log('postgreSQL is connected!');
// })
// // the pool will emit an error on behalf of any idle clients, will appear in terminal 
// pool.on('error',(error) =>{
//     console.log('Error with postgres pool', error);
// });

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

// router.get('/:id', (req, res) => {
//     //grab a value from the request url
//     const idToGet = req.params.id;
//     // check SQL query text in postico first!
//     let queryText = 'SELECT * FROM "songs" WHERE "id"=$1;';
//     // the second array arugment is optional, and is used when we add 
//     // sanitized parameters to queryText. sanatizing referring to ensuring
//     // no sql injection can occur
//     pool.query(queryText, [idToGet])
//         .then((result) =>{
//             res.send(result.rows);
//             console.log('song with id', idToGet);
//         }).catch((err) => {
//             console.log('error!', idToGet, queryText, err);
//             res.sendStatus(500);
//         })
// });
router.get('/', (req, res) => {
    //grab a value from the request url
    const idToGet = req.params.id;
    // check SQL query text in postico first!
    let queryText = 'SELECT * FROM "songs" ORDER BY "rank" DESC;';
    // the second array arugment is optional, and is used when we add 
    // sanitized parameters to queryText. sanatizing referring to ensuring
    // no sql injection can occur
    pool.query(queryText)
        .then((result) =>{
            res.send(result.rows);
            // console.log('song with id', idToGet);
        }).catch((err) => {
            console.log('error!', queryText, err);
            res.sendStatus(500);
        })
});

router.post('/', (req, res) => {
    // songs.push(req.body);
    // res.sendStatus(200);
    const newSong = req.body;
    const queryText = `
    INSERT INTO "songs" ("artist", "track", "published", "rank")
    VALUES ($1, $2, $3, $4);
    `;
    // parameterized query prevents SQL injection
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank])
        .then((result) => {
            res.sendStatus(201);
        }).catch((err)=> {
            console.log('error querying', queryText, err);
            res.sendStatus(500);
        })
});

router.delete('/:id',(req,res) => { //why is this still targetting the id in the url 
    //when the passthrough url already include it
    let reqId = req.params.id;
    console.log('delete id', reqId);
    let queryText = 'DELETE FROM "songs" WHERE "id" = $1;';
    pool.query(queryText,[reqId])
    .then((result) => {
        console.log('song deleted!');
        res.sendStatus(200);
    }).catch((error) => {
    console.log('error making database query', queryText, error);
    res.sendStatus(500);
    })
})

router.put('/:id', (req,res)=>{// will require req.body and req.params
    let idToUpdate = req.params.id;
    console.log(idToUpdate);
    console.log(req.body);
    let sqlText = ''
    if(req.body.direction === 'up' ){
       sqlText= `
        UPDATE "songs" 
        SET "rank" = "rank" - 1
        WHERE "id" =  $1;
        `
    }else if(req.body.direction === 'down'){
        sqlText = `
        UPDATE "songs" 
        SET "rank" = "rank" + 1
        WHERE "id" =  $1;
       `
    }else{
        // bad req...
        res.sendStatus(400);
        //NOTHING ELSE HAPPENS
        return;
    }
    let sqlValues = [idToUpdate];

    pool.query(sqlText, sqlValues)
    .then((result) => {
        res.sendStatus(200)
    }).catch((err) => {
        res.sendStatus(500);
    })
})

module.exports = router;