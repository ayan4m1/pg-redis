p = require 'p-promise'

cache = require './cache'
db = require './db'

module.exports = {
  init: db.init
  # expose prepare/execute api
  prepare: db.prepare
  # expose simplified, cache-enabled api
  query: (text, options) ->
    queried = p.defer()

    # caching disabled unless duration is specified
    options = options ? {
      duration: 0
    }

    execute = (params) ->
      db.prepare(text).then (stmt) ->
        stmt.execute(params).then (results) ->
          if options.duration > 0
            cache.store text, results.rows, options.duration
          queried.resolve results.rows
        .done()
      .done()

    # return results directly if cache hit, run query if cache miss
    cache.get(text).then(
      (results) -> queried.resolve results,
      (err) -> if err? then queried.reject err else execute()
    ).done()

    queried.promise
}