import { createHash } from 'crypto';
import { createClient } from 'redis';

const cache = createClient();

export default class Cache {
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
