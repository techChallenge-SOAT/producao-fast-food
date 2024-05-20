import { app } from '../../adapters/http/server';
import dbHandler from '../utils/db-handler';
import PedidoFilaModel from '../../adapters/database/models/pedido_fila';
import request from 'supertest';
import PedidoFilaRepository from '../../adapters/database/repositories/pedido_fila';

const db = new dbHandler();
const fixedDate = new Date('2022-01-01T12:00:00');

describe('Teste de integração do endpoint de obtem fila', () => {
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

  it('should return nothing if theres no pedidos in the fila', async () => {
    const res = await request(app).get('/fila');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should return the pedidos in the fila', async () => {
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

    //TODO: achar um jeito melhor de fazer essa adição, está muito acoplado à regra de negócio.
    const toSave = new PedidoFilaModel(pedido);
    await toSave.save();

    const response = await request(app).get('/fila');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].status).toBe(pedido.status);
    expect(response.body[0].pedido_id).toBe(pedido.pedido_id);
    expect(response.body[0].queue_id).toBe(pedido.queue_id);
    expect(response.body[0].data_pedido).toBe(pedido.data_pedido.toISOString());
    expect(response.body[0].tempo_estimado_preparo_min).toBe(
      pedido.tempo_estimado_preparo_min,
    );
    expect(response.body[0].itens).toBeDefined();
  });

  it('should return the pedidos in the fila filtered by status', async () => {
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

    let toSave = new PedidoFilaModel(pedido);
    await toSave.save();

    const pedido2 = { ...pedido, status: 'pronto' };
    toSave = new PedidoFilaModel(pedido2);
    await toSave.save();

    const res = await request(app).get('/fila');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe(pedido.status);
    expect(res.body[0].pedido_id).toBe(pedido.pedido_id);
    expect(res.body[0].queue_id).toBe(pedido.queue_id);
    expect(res.body[0].data_pedido).toBe(pedido.data_pedido.toISOString());
    expect(res.body[0].tempo_estimado_preparo_min).toBe(
      pedido.tempo_estimado_preparo_min,
    );
    expect(res.body[0].itens).toBeDefined();
  });

  it('should return the pedidos ordered by data_pedido', async () => {
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

    let toSave = new PedidoFilaModel(pedido);
    await toSave.save();

    const pedido2 = { ...pedido, data_pedido: new Date('2022-01-01T12:00:01') };
    toSave = new PedidoFilaModel(pedido2);
    await toSave.save();

    const res = await request(app).get('/fila');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].data_pedido).toBe(pedido.data_pedido.toISOString());
    expect(res.body[1].data_pedido).toBe(pedido2.data_pedido.toISOString());
  });

  it("should return 500 if there's an error", async () => {
    (
      jest.spyOn(PedidoFilaRepository.prototype, 'listar') as jest.Mock
    ).mockRejectedValue(new Error('Erro ao buscar pedidos na fila'));

    const res = await request(app).get('/fila');
    expect(res.status).toBe(500);
  });
});
