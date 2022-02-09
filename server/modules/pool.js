const pg = require('pg'); // is postgres/ how we communicate to the datsbase 
//similar to express as its a framework of JS
const Pool = pg.Pool; //pool is how we talk to the database capital P 
//Pool is referencing a connection to the database
const config = {
    database: 'music-library',
    host: 'localhost',
    port: 5432,
    max: 10, // number of routers, queries, etc
    idleTimeoutMillis: 30000, 
};

// create a new pool instance to manage our connections
const pool = new Pool(config);

pool.on('connect',() => {
    console.log('Postgres is connected!');
})

pool.on('error', (err) => {
    console.log('unexpected things!', err);
})

// to allow access to this pool instance from other code 
module.exports = pool;