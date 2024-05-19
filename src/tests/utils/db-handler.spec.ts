import dbHandler from './db-handler';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('mongoose', () => {
  return {
    connect: jest.fn(),
    connection: {
      dropDatabase: jest.fn(),
      close: jest.fn(),
      collections: {
        key: {
          deleteMany: jest.fn(),
        },
      },
    },
  };
});
jest.mock('mongodb-memory-server');

const mockURI = 'uri';

describe('db-handler', () => {
  it('should call mongoose.connect with the correct uri', async () => {
    MongoMemoryServer.create = jest.fn().mockImplementation(() => {
      return {
        getUri: jest.fn().mockReturnValue(mockURI),
        start: jest.fn().mockResolvedValue(''),
        stop: jest.fn().mockResolvedValue(''),
      };
    });
    const db = new dbHandler();
    await db.connect();
    expect(mongoose.connect).toHaveBeenCalledWith(mockURI, {});
  });

  it('should call mongoose.connection.dropDatabase', async () => {
    MongoMemoryServer.create = jest.fn().mockImplementation(() => {
      return {
        getUri: jest.fn().mockResolvedValue(mockURI),
        start: jest.fn().mockResolvedValue(''),
        stop: jest.fn().mockResolvedValue(''),
      };
    });
    const db = new dbHandler();
    await db.connect();
    await db.clear();
    expect(
      mongoose.connection.collections['key'].deleteMany,
    ).toHaveBeenCalled();
  });

  it('should call mongoose.connection.close', async () => {
    MongoMemoryServer.create = jest.fn().mockImplementation(() => {
      return {
        getUri: jest.fn().mockResolvedValue(mockURI),
        start: jest.fn().mockResolvedValue(''),
        stop: jest.fn().mockResolvedValue(''),
      };
    });
    const db = new dbHandler();
    await db.connect();
    await db.close();
    expect(mongoose.connection.close).toHaveBeenCalled();
  });

  it('should throw error if close is called before connect', async () => {
    const db = new dbHandler();
    await expect(db.close()).rejects.toThrow('mongod is not defined');
  });

  it('should throw error if clear is called before connect', async () => {
    const db = new dbHandler();
    await expect(db.clear()).rejects.toThrow('mongod is not defined');
  });
});
