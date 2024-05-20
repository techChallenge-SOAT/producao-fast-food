import Pedido, { Status } from './Pedido';

describe('Pedido', () => {
  it('should create a new Pedido instance', () => {
    const pedido = new Pedido('1', '12345678900', new Date(), Status.Recebido);

    expect(pedido).toBeInstanceOf(Pedido);
    expect(pedido.id).toBe('1');
    expect(pedido.cliente_cpf).toBe('12345678900');
    expect(pedido.data_pedido).toBeInstanceOf(Date);
    expect(pedido.status).toBe(Status.Recebido);
  });
});
