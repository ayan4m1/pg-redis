var dbConfig, p, pg;

pg = require('pg');

p = require('p-promise');

dbConfig = {};

module.exports = {
  init: function(config) {
    return dbConfig = config;
  },
  config: function() {
    return dbConfig;
  },
  prepare: function(text) {
    var connected, createStatement;
    connected = p.defer();
    createStatement = function(client, done) {
      return {
        execute: function(params) {
          var queried;
          queried = p.defer();
          client.query(text, params, function(err, results) {
            done();
            if (err != null) {
              queried.reject(err);
            }
            return queried.resolve(results);
          });
          return queried.promise;
        }
      };
    };
    pg.connect(dbConfig, function(err, client, done) {
      if (err != null) {
        connected.reject(err);
      }
      return connected.resolve(createStatement(client, done));
    });
    return connected.promise;
  }
};
