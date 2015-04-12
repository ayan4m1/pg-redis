pg = require 'pg'
p = require 'p-promise'

dbConfig = {}

module.exports =
  init: (config) -> dbConfig = config
  config: -> dbConfig
  prepare: (text) ->
    connected = p.defer()

    createStatement = (client, done) ->
      execute: (params) ->
        queried = p.defer()

        client.query text, params, (err, results) ->
          done()
          queried.reject err if err?
          queried.resolve results

        queried.promise

    pg.connect dbConfig, (err, client, done) ->
      connected.reject err if err?
      connected.resolve createStatement client, done

    connected.promise