var cache, db, p;

p = require('p-promise');

cache = require('./cache');

db = require('./db');

module.exports = {
  init: db.init,
  prepare: db.prepare,
  query: function(text, options) {
    var execute, queried;
    queried = p.defer();
    options = options != null ? options : {
      duration: 0
    };
    execute = function(params) {
      return db.prepare(text).then(function(stmt) {
        return stmt.execute(params).then(function(results) {
          if (options.duration > 0) {
            cache.store(text, results.rows, options.duration);
          }
          return queried.resolve(results.rows);
        }).done();
      }).done();
    };
    cache.get(text).then(function(results) {
      return queried.resolve(results);
    }, function(err) {
      if (err != null) {
        return queried.reject(err);
      } else {
        return execute();
      }
    }).done();
    return queried.promise;
  }
};
