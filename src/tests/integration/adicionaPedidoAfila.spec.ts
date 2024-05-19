import supertest from 'supertest';
import { app } from '../../adapters/http/server';
import dbHandler from '../utils/db-handler';
import PedidoFilaRepository from '../../adapters/database/repositories/pedido_fila';

const db = new dbHandler();
const fixedDate = new Date('2022-01-01T12:00:00');

describe('Teste de integração do endpoint de adicionar pedido a fila', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await db.clear();
  });

  afterAll(async () => {
    await db.close();
  });

  it('should return 400 if theres no body in the request', async () => {
    const response = await supertest(app).post('/pedido');
    expect(response.status).toBe(400);
  });

  it('should return 400 if the body is not a valid Pedido', async () => {
    const response = await supertest(app).post('/pedido').send({});
    expect(response.status).toBe(400);
  });

  it('should return 400 if the body is a Pedido without itens', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      status: 'pago',
      id: 'pedidoid1',
      data_pedido: fixedDate,
    };

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);
    expect(response.status).toBe(400);
  });

  it('should return 400 if no id is given', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      status: 'pago',
      data_pedido: fixedDate,
      itens: [],
    };

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);
    expect(response.status).toBe(400);
  });

  it('should return 400 if no status is given', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      id: 'pedidoid1',
      data_pedido: fixedDate,
      itens: [],
    };

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);

    expect(response.status).toBe(400);
  });

  it('should return 400 if no data_pedido is given', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      status: 'pago',
      id: 'pedidoid1',
      itens: [],
    };

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);

    expect(response.status).toBe(400);
  });

  it('should return 400 if itens is an empty array', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      status: 'pago',
      id: 'pedidoid1',
      data_pedido: fixedDate,
      itens: [],
    };

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);

    expect(response.status).toBe(400);
  });

  it('should return 200 if the body is a valid Pedido', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      status: 'pago',
      id: 'pedidoid1',
      data_pedido: fixedDate,
      itens: [
        {
          id: 'itemid1',
          categoria: 'Categoria 1',
          nome: 'Item 1',
          descricao: 'Descrição do Item 1',
          preco_unitario: 10.0,
        },
      ],
    };

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);
    expect(response.status).toBe(200);
    expect(response.body.cliente_cpf).toBe(pedidoFromPedidos.cliente_cpf);
  });

  it('should return 500 if an error occurs', async () => {
    const pedidoFromPedidos = {
      cliente_cpf: '12345678900',
      status: 'pago',
      id: 'pedidoid1',
      data_pedido: fixedDate,
      itens: [
        {
          id: 'itemid1',
          categoria: 'Categoria 1',
          nome: 'Item 1',
          descricao: 'Descrição do Item 1',
          preco_unitario: 10.0,
        },
      ],
    };

    (
      jest.spyOn(PedidoFilaRepository.prototype, 'criar') as jest.Mock
    ).mockRejectedValue(new Error('Erro ao adicionar pedido na fila'));

    const response = await supertest(app)
      .post('/pedido')
      .send(pedidoFromPedidos);

    expect(response.status).toBe(500);
  });
});
