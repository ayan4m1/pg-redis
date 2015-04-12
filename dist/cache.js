var cache, crypto, p, redis;

p = require('p-promise');

redis = require('redis');

crypto = require('crypto');

cache = redis.createClient();

module.exports = {
  hash: function(input) {
    var hash;
    hash = crypto.createHash('sha1');
    hash.update(input);
    return hash.digest('hex');
  },
  store: function(query, results, duration) {
    var hash;
    hash = this.hash(query);
    cache.set(hash, JSON.stringify(results));
    return cache.expire(hash, duration);
  },
  get: function(query) {
    var hash, queried;
    hash = this.hash(query);
    queried = p.defer();
    cache.exists(hash, function(err, exists) {
      if (err != null) {
        return queried.reject(err);
      }
      if (!exists) {
        return queried.reject();
      }
      return cache.get(hash, function(err, results) {
        if (err != null) {
          return queried.reject(err);
        }
        return queried.resolve(JSON.parse(results));
      });
    });
    return queried.promise;
  }
};
