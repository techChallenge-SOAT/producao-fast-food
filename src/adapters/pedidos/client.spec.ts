import client from './client';

const json = jest.fn(() => Promise.resolve({ test: 100 }));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json,
  }),
) as jest.Mock;

describe('Client de Pedidos', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (fetch as jest.Mock).mockClear();
  });
  it('should call fetch with right url', async () => {
    const id = 'id';
    const status = 'status';

    const pedidosClient = new client();
    await pedidosClient.atualizaStatusPedido(id, status);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3000/pedidos/pedidos/${id}`,
      expect.any(Object),
    );
  });

  it('should throw if fetch is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json,
    });

    const pedidosClient = new client();
    await expect(
      pedidosClient.atualizaStatusPedido('id', 'status'),
    ).rejects.toThrowError('HTTP error! Status: 400');
  });
});
