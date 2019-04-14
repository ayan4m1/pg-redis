p = require 'p-promise'
redis = require 'redis'
crypto = require 'crypto'

# connect to redis
cache = redis.createClient()

module.exports = {
  hash: (input) ->
    hash = crypto.createHash 'sha1'
    hash.update input
    # todo: configurable key building function
    hash.digest 'hex'
  store: (query, results, duration) ->
    hash = @hash query
    cache.set hash, JSON.stringify results
    cache.expire hash, duration
  get: (query) ->
    hash = @hash query
    queried = p.defer()

    cache.exists hash, (err, exists) ->
      return queried.reject err if err?
      return queried.reject() unless exists

      cache.get hash, (err, results) ->
        return queried.reject err if err?
        queried.resolve JSON.parse results

    queried.promise
}