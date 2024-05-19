import mongoose from 'mongoose';
import PedidoFilaModel from './pedido_fila';
import dbHandler from '../../../tests/db-handler';
import { Status } from '../../../application/valueObjects/Pedido';

const db = new dbHandler();

describe('PedidoFilaModel', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => await db.close());

  afterEach(async () => {
    jest.clearAllMocks();
    await db.clear();
  });

  it('should create and save a new pedido fila successfully', async () => {
    const pedidoFilaData = {
      queue_id: 'queue_id_1',
      cliente_cpf: '123456789',
      status: Status.Recebido,
      pedido_id: 'pedido_id_1',
      data_pedido: new Date(),
      itens: [
        {
          categoria: 'Categoria 1',
          nome: 'Item 1',
          descricao: 'Descrição do Item 1',
          preco_unitario: 10.0,
          toValueObject: jest.fn(),
        },
      ],
      tempo_estimado_preparo_min: 30,
      toValueObject: jest.fn(),
    };

    const pedido = new PedidoFilaModel(pedidoFilaData);
    const savedPedidoFila = await pedido.save();

    expect(savedPedidoFila._id).toBeDefined();
    expect(savedPedidoFila.queue_id).toBe(pedidoFilaData.queue_id);
    expect(savedPedidoFila.cliente_cpf).toBe(pedidoFilaData.cliente_cpf);
    expect(savedPedidoFila.status).toBe(pedidoFilaData.status);
    expect(savedPedidoFila.pedido_id).toBe(pedidoFilaData.pedido_id);
    expect(savedPedidoFila.data_pedido).toEqual(pedidoFilaData.data_pedido);
    expect(savedPedidoFila.itens.length).toBe(1);
    expect(savedPedidoFila.tempo_estimado_preparo_min).toBe(
      pedidoFilaData.tempo_estimado_preparo_min,
    );
  });

  it('should throw validation error if required fields are missing', async () => {
    const pedidoFilaData = {
      queue_id: 'queue_id_1',
      pedido_id: 'pedido_id_1',
      data_pedido: new Date(),
      itens: [
        {
          categoria: 'Categoria 1',
          nome: 'Item 1',
          descricao: 'Descrição do Item 1',
          preco_unitario: 10.0,
          toValueObject: jest.fn(),
        },
      ],
      tempo_estimado_preparo_min: 30,
      toValueObject: jest.fn(),
    };

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = null;
    try {
      const pedido = new PedidoFilaModel(pedidoFilaData);
      await pedido.save();
    } catch (err) {
      error = err;
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.cliente_cpf).toBeDefined();
      expect(error.errors.status).toBeDefined();
    }
  });

  it('should return the correct value object when calling toValueObject', () => {
    const pedidoFilaData = {
      queue_id: 'queue_id_1',
      cliente_cpf: '123456789',
      status: Status.Recebido,
      pedido_id: 'pedido_id_1',
      data_pedido: new Date(),
      itens: [
        {
          categoria: 'Categoria 1',
          nome: 'Item 1',
          descricao: 'Descrição do Item 1',
          preco_unitario: 10.0,
        },
      ],
      tempo_estimado_preparo_min: 30,
    };
    const pedido = new PedidoFilaModel(pedidoFilaData);
    const valueObject = pedido.toValueObject();
    expect(valueObject.queue_id).toBe(pedidoFilaData.queue_id);
    expect(valueObject.cliente_cpf).toBe(pedidoFilaData.cliente_cpf);
    expect(valueObject.status).toBe(pedidoFilaData.status);
    expect(valueObject.pedido_id).toBe(pedidoFilaData.pedido_id);
    expect(valueObject.data_pedido).toEqual(pedidoFilaData.data_pedido);
    expect(valueObject.itens.length).toBe(1);
    expect(valueObject.tempo_estimado_preparo_min).toBe(
      pedidoFilaData.tempo_estimado_preparo_min,
    );
  });
});
