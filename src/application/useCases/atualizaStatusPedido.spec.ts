import AtualizarStatus from './atualizaStatusPedido';
import { IRepository } from '../interfaces/repository';
import Item from '../valueObjects/Item';
import PedidoFila from '../valueObjects/PedidoFila';
import IPedidoService from '../interfaces/pedido_service';
import { Status } from '../valueObjects/Pedido';

describe('AtualizarStatus', () => {
  let repository: IRepository<PedidoFila<Item>>;
  let client: IPedidoService;
  let atualizaStatus: AtualizarStatus;

  beforeEach(() => {
    repository = {
      criar: jest.fn(),
      listar: jest.fn(),
      remover: jest.fn(),
      atualizarStatus: jest.fn().mockResolvedValue({
        pedido_id: 'a',
        status: Status.Recebido,
      } as PedidoFila<Item>),
    };
    client = {
      atualizaStatusPedido: jest.fn(),
    };
    atualizaStatus = new AtualizarStatus(repository, client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call atualizarStatus with right params', async () => {
    // Arrange
    const id = '1';
    const status = 'status';
    // Act
    await atualizaStatus.execute(id, status);

    // Assert
    expect(repository.atualizarStatus).toHaveBeenCalledWith('1', 'status');
    // ...
  });

  it('should call client.atualizaStatusPedido with right params', async () => {
    // Arrange
    const id = '1';
    const status = 'status';
    // Act
    await atualizaStatus.execute(id, status);

    // Assert
    expect(client.atualizaStatusPedido).toHaveBeenCalledWith(
      'a',
      Status.Recebido,
    );
    // ...
  });

  it('should throw an error if the repository throws an error', async () => {
    // Arrange
    const id = '1';
    const status = 'status';
    const errorMessage = 'Error atualizando pedido';
    repository.atualizarStatus = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    // Act
    const result = atualizaStatus.execute(id, status);

    // Assert
    await expect(result).rejects.toThrow(errorMessage);
  });
});
