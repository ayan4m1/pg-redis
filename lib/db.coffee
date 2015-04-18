pg = require 'pg'
p = require 'p-promise'

dbConfig = {}

module.exports =
  init: (config) -> dbConfig = config
  config: -> dbConfig
  prepare: (text, options = {}) ->
    {
      client # if set, use this instead of getting a connection from the pool
      batch # boolean, true if connection should remain open after execution
    } = options

    connected = p.defer()

    createStatement = (client, release) ->
      client: client
      text: text
      release: release ? null
      execute: (params) ->
        queried = p.defer()

        @client.query @text, params, (err, res) ->
          @release() if @release? and batch isnt true
          # fulfill promise based on results
          queried.reject err if err?
          queried.resolve res

        queried.promise

    # use existing client if provided
    if client?
      connected.resolve createStatement(client)
    else # fetch a connection from the pool
      pg.connect dbConfig, (err, client, release) ->
        connected.reject err if err?
        connected.resolve createStatement(client, release)

    connected.promise