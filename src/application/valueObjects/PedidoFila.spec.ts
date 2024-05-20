import PedidoFila from './PedidoFila';
import { Status } from './Pedido';

const fixedDate = new Date('2022-01-01T12:00:00');

describe('PedidoFila', () => {
  it('should create a new PedidoFila instance', () => {
    const pedidoFila = new PedidoFila(
      '12345678900',
      fixedDate,
      Status.Recebido,
      'iddopedido',
      [],
    );

    expect(pedidoFila).toBeInstanceOf(PedidoFila);
    expect(pedidoFila.id).toBeDefined();
    expect(pedidoFila.cliente_cpf).toBe('12345678900');
    expect(pedidoFila.data_pedido).toBeInstanceOf(Date);
    expect(pedidoFila.pedido_id).toBe('iddopedido');
    expect(pedidoFila.status).toBe(Status.Recebido);
  });
});
