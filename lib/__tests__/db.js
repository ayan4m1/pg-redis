import Database from '../db';

import { cosmiconfigSync } from 'cosmiconfig';

describe('Database', () => {
  const { config: configs } = cosmiconfigSync('pgredis').search();
  const { postgres: config } = configs;
  const db = new Database(config);

  afterAll(async () => {
    await db.pool.end();
  });

  it('should have a pool getter', () => {
    expect(db.pool).toBeDefined();
  });

  it('should have a config getter', () => {
    expect(db.config).toBeDefined();
  });

  it('should return the initialized config', () => {
    expect(db.config).toBe(config);
  });

  it('should have a prepare method', () => {
    expect(db.prepare).toBeDefined();
  });

  it('should return a promise', async () => {
    const promise = db.prepare('select 1');

    expect(promise).toBeDefined();
    expect(promise.then).toBeDefined();

    const stmt = await promise;

    stmt.client.release();
  });

  it('should execute a select query', async () => {
    const stmt = await db.prepare('select 1 static');

    expect(stmt).toBeDefined();
    expect(stmt.execute).toBeDefined();

    const result = await stmt.execute();

    expect(result.rowCount).toBeDefined();
    expect(result.rows).toBeDefined();
    expect(result.rows[0].static).toBe(1);
  });

  it('should execute a batch insert', async () => {
    const stmt = await db.prepare(
      'begin; create temporary table temp_insert_test (dummy integer);',
      { batch: true }
    );

    expect(stmt.execute).toBeDefined();
    await stmt.execute();
    const innerStmt = await db.prepare(
      'insert into temp_insert_test values ($1::integer)',
      {
        client: stmt.client,
        batch: true
      }
    );
    const inserts = [];

    for (let i = 1; i <= 1000; i++) {
      inserts.push(innerStmt.execute([i]));
    }

    const results = await Promise.all(inserts);

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    stmt.client.release();
  });
});
