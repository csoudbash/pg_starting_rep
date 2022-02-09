
        ROUTES | SQL COMMAND
Create  (POST)  INSERT
Read    (GET)   SELCT
Update  (PUT)   UPDATE
Delete (DELETE) DELETE

Connection pooling refers to the method of creating a pool of connections and caching those connections so that it can be reused again.
PostgreSQL has a postmaster process, which spawns new processes for each new connection to the database. This process takes up around 2 to 3 MB memory which happens every time you create a connection to the database. Without connection pooling, for each connection, the postmaster process will have to spawn a new process at the back end using 2 to 3 MB memory and this creates a problem if the number of connections are too high (typically seen in mission critical applications). Higher the number of connections, more is the memory consumed for creating these connections.
With Connection pooling, whenever there is a request from the front-end application to create a connection to the database, a connection is created from the pool. After the session or transaction is completed, connection is given back to the pool.