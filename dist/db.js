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
  prepare: function(text, options) {
    var batch, client, connected, createStatement;
    if (options == null) {
      options = {};
    }
    client = options.client, batch = options.batch;
    connected = p.defer();
    createStatement = function(client, release) {
      return {
        client: client,
        text: text,
        release: release != null ? release : null,
        execute: function(params) {
          var queried;
          queried = p.defer();
          this.client.query(this.text, params, function(err, res) {
            if ((this.release != null) && batch !== true) {
              this.release();
            }
            if (err != null) {
              queried.reject(err);
            }
            return queried.resolve(res);
          });
          return queried.promise;
        }
      };
    };
    if (client != null) {
      connected.resolve(createStatement(client));
    } else {
      pg.connect(dbConfig, function(err, client, release) {
        if (err != null) {
          connected.reject(err);
        }
        return connected.resolve(createStatement(client, release));
      });
    }
    return connected.promise;
  }
};
