# pg-redis

A pg query wrapper with implicit redis query caching.

## Installation

    npm install pg-redis

## Usage

    var pgRedis = require('pg-redis').connect({
        // a node-postgres config object, documented at
        // https://github.com/brianc/node-postgres/wiki/Client#parameters
    };

    // normal usage, caches the result for two minutes
    pgRedis.query('select * from entity', {
      duration: 120
    }).then(function (results) {
      console.log(results);
    }, function (error) {
      console.error(error);
    }).done();

## Testing

    npm test