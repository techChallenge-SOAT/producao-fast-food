import { IRepository } from '../interfaces/repository';
import Item from '../valueObjects/Item';
import PedidoFila, { PedidoFilaDTO } from '../valueObjects/PedidoFila';
class AdicionaPedidoAFila {
  repository: IRepository<PedidoFila<Item>>;
  constructor(repository: IRepository<PedidoFila<Item>>) {
    this.repository = repository;
  }
  async execute(pedido: PedidoFilaDTO): Promise<PedidoFila<Item>> {
    const pedidoInstanciado = new PedidoFila<Item>(
      pedido.cliente_cpf,
      pedido.data_pedido,
      pedido.status,
      pedido.pedido_id,
      pedido.itens,
    );
    return await this.repository.criar(pedidoInstanciado);
  }
}

export default AdicionaPedidoAFila;
