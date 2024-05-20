import supertest from 'supertest';
import { app } from '../../adapters/http/server';
import dbHandler from '../utils/db-handler';
import PedidoFilaRepository from '../../adapters/database/repositories/pedido_fila';
import PedidoFilaModel from '../../adapters/database/models/pedido_fila';

const db = new dbHandler();
const fixedDate = new Date('2022-01-01T12:00:00');

jest.mock('../../adapters/pedidos/client');

describe('Teste de integração do endpoint de atualizar status do pedido', () => {
  let pedidoId: string;
  beforeAll(async () => {
    await db.connect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await db.clear();
    const pedido = {
      status: 'pago',
      pedido_id: 'pedidoid1',
      queue_id: 'queueid1',
      data_pedido: fixedDate,
      tempo_estimado_preparo_min: 30,
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

    const toSave = new PedidoFilaModel(pedido);
    await toSave.save();
    pedidoId = toSave._id;
  });

  afterAll(async () => {
    await db.close();
  });

  it('should return 400 if theres no body in the request', async () => {
    const response = await supertest(app).patch(`/pedido/${pedidoId}`);
    expect(response.status).toBe(400);
  });

  it('should return 400 if the body is not a valid Pedido', async () => {
    const response = await supertest(app).patch(`/pedido/${pedidoId}`).send({});
    expect(response.status).toBe(400);
  });

  it('should return 200 if the body is valid', async () => {
    const pedidoFromPedidos = {
      status: 'pago',
    };

    const response = await supertest(app)
      .patch(`/pedido/${pedidoId}`)
      .send(pedidoFromPedidos);
    expect(response.status).toBe(200);
  });

  it('should return 404 if the pedido does not exist', async () => {
    const pedidoFromPedidos = {
      status: 'pago',
    };

    const response = await supertest(app)
      .patch(`/pedido/4edd40c86762e0fb12000003`)
      .send(pedidoFromPedidos);
    expect(response.status).toBe(404);
  });

  it('should return 400 if the status is invalid', async () => {
    const pedidoFromPedidos = {
      status: 'invalido',
    };

    const response = await supertest(app)
      .patch(`/pedido/${pedidoId}`)
      .send(pedidoFromPedidos);
    expect(response.status).toBe(400);
  });

  it('should return 500 if something goes wrong', async () => {
    const pedidoFromPedidos = {
      status: 'pago',
    };

    (
      jest.spyOn(PedidoFilaRepository.prototype, 'atualizarStatus') as jest.Mock
    ).mockImplementationOnce(() => {
      throw new Error('Erro');
    });

    const response = await supertest(app)
      .patch(`/pedido/${pedidoId}`)
      .send(pedidoFromPedidos);
    expect(response.status).toBe(500);
  });
});
