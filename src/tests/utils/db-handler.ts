import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export default class MockDatabase {
  mongod?: MongoMemoryServer;
  async connect() {
    this.mongod = await MongoMemoryServer.create();
    const uri = this.mongod.getUri();
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
    if (mongoose.connection.readyState === 0) {
      return;
    }
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}
