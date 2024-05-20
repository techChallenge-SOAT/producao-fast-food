import ObtemFila from './obtemFila';
import { IRepository } from '../interfaces/repository';
import Item from '../valueObjects/Item';
import PedidoFila from '../valueObjects/PedidoFila';

describe('ObtemFila', () => {
  let repository: IRepository<PedidoFila<Item>>;
  let obtemFila: ObtemFila;

  beforeEach(() => {
    repository = {
      criar: jest.fn(),
      listar: jest.fn(),
      remover: jest.fn(),
      atualizarStatus: jest.fn(),
    };
    obtemFila = new ObtemFila(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call listar', async () => {
    // Arrange

    // Act
    await obtemFila.execute();

    // Assert
    expect(repository.listar).toHaveBeenCalled();
    // ...
  });

  it('should throw an error if the repository throws an error', async () => {
    // Arrange

    const errorMessage = 'Error adding pedido to the fila';
    repository.listar = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Act
    const result = obtemFila.execute();

    // Assert
    await expect(result).rejects.toThrow(errorMessage);
  });
});
