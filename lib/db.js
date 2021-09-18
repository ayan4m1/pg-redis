import { Pool } from 'pg';

export default class Database {
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
