p = require 'p-promise'
config = require('konfig')()

describe 'db', ->
  db = require '../dist/db'

  it 'should have an init method', ->
    expect(db.init).toBeDefined()

  it 'should have a config getter', ->
    expect(db.config).toBeDefined()

  it 'should return the initialized config', ->
    db.init(config.db)
    expect(db.config()).toBe(config.db)

  it 'should have a prepare method', ->
    expect(db.prepare).toBeDefined()

  it 'should return a promise', ->
    result = db.prepare('select 1')
    expect(result).toBeDefined()
    expect(result.then).toBeDefined()

  it 'should execute a select query', (done) ->
    db.prepare('select 1 static').then (stmt) ->
      expect(stmt).toBeDefined()
      expect(stmt.execute).toBeDefined()

      stmt.execute().then (result) ->
        expect(result.rowCount).toBeDefined()
        expect(result.rows).toBeDefined()
        expect(result.rows[0].static).toBe(1)
      , (err) ->
        console.error err
        expect(err).toBeUndefined()
      .done(done)
    , (err) ->
      console.error err
      expect(err).toBeUndefined()
    .done()

  it 'should execute a batch insert', (done) ->
    db.prepare('begin; create temporary table temp_insert_test (dummy integer);', { batch: true })
    .then (stmt) ->
      release = stmt.release
      stmt.execute().then ->
        db.prepare('insert into temp_insert_test values ($1::integer)', { client: stmt.client })
        .then (stmt) ->
          inserts = []
          inserts.push(stmt.execute([i])) for i in [1 .. 1000]
          p.all(inserts).then (results) ->
            expect(results).toBeDefined()
            release()
          .done(done)
        .done()
      .done()
    .done()