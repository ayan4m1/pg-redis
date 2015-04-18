# pg-redis

A pg query wrapper with implicit redis query caching.

## Installation

    npm install pg-redis

## Usage

    var pgRedis = require('pg-redis');
    pgRedis.init({
        // a node-postgres config object, documented at
        // https://github.com/brianc/node-postgres/wiki/Client#parameters
    });

    // normal usage, caches the result for two minutes
    pgRedis.query('select * from entity', {
      duration: 120
    }).then(function (results) {
      console.log(results);
    }, function (error) {
      console.error(error);
    }).done();

    // bypassing the cache in favor of the prepare/execute api
    pgRedis.prepare('select * from entity where date between ? and ?').then(function (stmt) {
      stmt.execute([startDate, endDate]).then(function (results) {
        console.log(results);
      }).done();
    }).done();

    // efficient batching operations can be done this way
    // pass batch:true in prepare options to initiate a new batch operation
    pgRedis.prepare('begin; create temporary table temp_table like (table)', {batch:true}).then(function (stmt) {
        // we must call release() when done with the transaction
        // stmt.release is only defined for the first prepared statement in a chain with {batch:true}
        var release = stmt.release;
        stmt.execute().then(function () {
            pgRedis.prepare('insert into temp_table values ($1, $2, $3)', {client:stmt.client}, function(stmt) {
                var data = [[1,2,3], [4,5,6], [7,8,9]],
                    inserts = [];

                // build an array of promises to insert individual rows
                for (var i = 0; i < data.length; i++) {
                    inserts.push(stmt.execute(data[i]));
                }

                // perform inserts in parallel using the same connection
                p.all(inserts).then(function () {
                    // make sure that release() is called regardless of success or failure
                    pgRedis.prepare('select merge_data(); commit;').then(function (stmt) {
                        // release the connection regardless of commit result
                        stmt.execute().then(null, function (err) {
                            console.error('an error occurred executing the merge statement', err);
                        }).fin(function () { release(); }).done();
                    }, function (err) {
                        console.error('an error occurred preparing the merge statement', err);
                    }).done();
                }, function (err) {
                    console.error('an error occurred during the insertion of data', err);
                }).done();
            }, function (err) {
                console.error('an error occurred preparing the insert statement', err);
            }).done();
        }, function (err) {
            console.error('an error occurred preparing the temporary table creation statement', err);
        }).done();
    }).done();

## Testing

    npm test