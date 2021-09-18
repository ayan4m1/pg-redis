import { createHash } from 'crypto';
import { createClient } from 'redis';
import { Pool } from 'pg';

const cache = createClient();

class Cache {
  hash(input) {
    const hash = createHash('sha1');

    hash.update(input);
    return hash.digest('hex');
  }

  async store(query, results, duration) {
    const hash = this.hash(query);

    await cache.set(hash, JSON.stringify(results));
    cache.expire(hash, duration);
  }

  async get(query) {
    const hash = this.hash(query);

    const exists = await cache.exists(hash);

    return exists ? await cache.get(hash) : null;
  }
}

class Database {
  constructor(config) {
    this.config = config;
    this.pool = new Pool(this.config);
  }

  async prepare(text, options = {}) {
    const {
      client: existingClient, // if set, use this instead of getting a connection from the pool
      batch // boolean, true if connection should remain open after execution
    } = options;

    // get a new client from the pool if one is needed
    const client = existingClient ? existingClient : await this.pool.connect();

    return {
      client,
      text,
      execute: async (params) => {
        const results = await client.query(text, params);

        if (client.release && batch !== true) {
          client.release();
        }

        return results;
      }
    };
  }
}

class PgRedis {
  constructor(config) {
    this.cache = new Cache();
    this.db = new Database(config);
  }

  async prepare(text, options) {
    return this.db.prepare(text, options);
  }

  async query(
    text,
    options = {
      duration: 0
    }
  ) {
    const cacheHit = this.cache.get(text);

    if (cacheHit) {
      return cacheHit;
    } else {
      const statement = await this.db.prepare(text, options);
      const results = await statement.execute();

      if (options.duration > 0) {
        this.cache.store(text, results.rows, options.duration);
      }

      return results.rows;
    }
  }
}

export { PgRedis };
