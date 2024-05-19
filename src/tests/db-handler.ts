// tests/db-handler.js

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export default class MockDatabase {
  mongod?: MongoMemoryServer;
  async connect() {
    this.mongod = await MongoMemoryServer.create();
    const uri = this.mongod.getUri();
    console.log('uri', uri);
    await mongoose.connect(uri, {});
  }
  async close() {
    if (!this.mongod) {
      throw new Error('mongod is not defined');
    }
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.mongod.stop();
  }
  async clear() {
    if (!this.mongod) {
      throw new Error('mongod is not defined');
    }
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}
