import AdicionaPedidoAFila from './adicionaPedidoAFila';
import { IRepository } from '../interfaces/repository';
import Item from '../valueObjects/Item';
import PedidoFila, { PedidoFilaDTO } from '../valueObjects/PedidoFila';
import { Status } from '../valueObjects/Pedido';

const fixedDate = new Date('2022-01-01T12:00:00');

describe('AdicionaPedidoAFila', () => {
  let repository: IRepository<PedidoFila<Item>>;
  let adicionaPedidoAFila: AdicionaPedidoAFila;

  beforeEach(() => {
    repository = {
      criar: jest
        .fn()
        .mockImplementation((pedido: PedidoFila<Item>) =>
          Promise.resolve(pedido),
        ),
      listar: jest.fn(),
      remover: jest.fn(),
      atualizarStatus: jest.fn(),
    };
    adicionaPedidoAFila = new AdicionaPedidoAFila(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call create with right params', async () => {
    // Arrange
    const pedido: PedidoFilaDTO = {
      cliente_cpf: '12345678910',
      data_pedido: fixedDate,
      status: Status.Recebido,
      id: '1',
      itens: [],
    };

    // Act
    const adicionado = await adicionaPedidoAFila.execute(pedido);

    // Assert
    expect(adicionado.cliente_cpf).toBe('12345678910');
    expect(adicionado.data_pedido).toBe(fixedDate);
    expect(adicionado.status).toBe(Status.Recebido);
    expect(adicionado.pedido_id).toBe('1');
    expect(adicionado.itens).toEqual([]);
    expect(adicionado.id).toBeDefined();
    // ...
  });

  it('should throw an error if the repository throws an error', async () => {
    // Arrange
    const pedido: PedidoFilaDTO = {
      cliente_cpf: '12345678910',
      data_pedido: fixedDate,
      status: Status.Recebido,
      id: '1',
      itens: [],
    };
    const errorMessage = 'Error adding pedido to the fila';
    repository.criar = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Act
    const result = adicionaPedidoAFila.execute(pedido);

    // Assert
    await expect(result).rejects.toThrow(errorMessage);
  });
});
