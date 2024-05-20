import { app } from '../../adapters/http/server';
import supertest from 'supertest';
import dbHandler from '../utils/db-handler';
import mongoose from 'mongoose';

const db = new dbHandler();

describe('Teste de integração do endpoint de healthcheck', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await db.clear();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await db.close();
    }
  });

  it('should return 200 if the service is healthy', async () => {
    const response = await supertest(app).get('/health');
    expect(response.status).toBe(200);
  });

  it('should return the message "Service is healthy" if the service is healthy', async () => {
    const response = await supertest(app).get('/health');
    expect(response.body).toEqual({ message: 'Microsserviço de Produção' });
  });

  it('should return 500 if the service is unhealthy', async () => {
    await db.close();

    const response = await supertest(app).get('/health');
    expect(response.status).toBe(500);
  });
});
