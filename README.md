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

## Testing

    npm test