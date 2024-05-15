import Repository from './pedido_fila';
import type PedidoFila from '../../../application/valueObjects/PedidoFila';
import type Item from '../../../application/valueObjects/Item';
import { Status } from '../../../application/valueObjects/Pedido';
import dbHandler from '../../../tests/db-handler';

const fixedDate = new Date('2022-01-01T12:00:00');

const db = new dbHandler();

describe('PedidoFila', () => {
  let repository: Repository;
  let pedidoFilaStub: PedidoFila<Item>;

  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(() => {
    repository = new Repository();
    pedidoFilaStub = {
      id: '1',
      queue_id: '1',
      cliente_cpf: '12345678900',
      status: Status.Recebido,
      pedido_id: '1',
      data_pedido: fixedDate,
      itens: [],
      tempo_estimado_preparo_min: 0,
    };
  });
  afterEach(async () => {
    jest.clearAllMocks();
    await db.clear();
  });

  afterAll(async () => await db.close());

  it('should add a order to the queue', async () => {
    const pedido = pedidoFilaStub;
    await repository.criar(pedido);
    const list = await repository.listar();
    const found = list.find((p) => p.pedido_id === pedido.pedido_id);
    expect(found).toBeTruthy();
  });

  it('should remove a pedido from the fila', async () => {
    const pedido = pedidoFilaStub;
    const novoPedido = await repository.criar(pedido);
    await repository.remover(novoPedido.id);
    expect(repository.listar()).not.toContain(pedido);
  });

  it('should return the total number of pedidos in the fila', async () => {
    const pedido1 = pedidoFilaStub;
    const pedido2 = Object.assign({} as PedidoFila<Item>, pedidoFilaStub);
    await repository.criar(pedido1);
    await repository.criar(pedido2);
    expect((await repository.listar()).length).toBe(2);
  });

  it('should update the status of a pedido in the fila', async () => {
    const pedido = pedidoFilaStub;
    const pedidoCriado = await repository.criar(pedido);
    const pedidoParaAtualizar = Object.assign({} as PedidoFila<Item>, pedido, {
      status: Status.Preparacao,
    });
    await repository.atualizarStatus(pedidoCriado.id, pedidoParaAtualizar);

    const lista = await repository.listar();
    const encontrado = lista.find(
      (p) => p.pedido_id === pedidoCriado.pedido_id,
    );
    if (!encontrado) {
      throw new Error('Pedido não encontrado');
    }
    expect(encontrado.status).toBe(Status.Preparacao);
  });
});
