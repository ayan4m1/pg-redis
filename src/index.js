import Cache from './cache.js';
import Database from './db.js';

export class PgRedis {
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
