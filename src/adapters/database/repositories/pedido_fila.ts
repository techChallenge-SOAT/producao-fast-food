import { Status } from 'src/application/valueObjects/Pedido';
import type Item from '../../../application/valueObjects/Item';
import type PedidoFila from '../../../application/valueObjects/PedidoFila';
import PedidoFilaModel from '../models/pedido_fila';
class PedidoFilaRepository {
  async criar(pedido: PedidoFila<Item>): Promise<PedidoFila<Item>> {
    const novoPedido = new PedidoFilaModel({
      queue_id: pedido.queue_id,
      cliente_cpf: pedido.cliente_cpf,
      status: pedido.status,
      pedido_id: pedido.pedido_id,
      data_pedido: pedido.data_pedido,
      itens: pedido.itens,
      tempo_estimado_preparo_min: pedido.tempo_estimado_preparo_min,
    });

    const saved = await novoPedido.save();
    const pedidoSalvo: PedidoFila<Item> = saved.toValueObject();
    return pedidoSalvo;
  }

  async listar(): Promise<PedidoFila<Item>[]> {
    const pedidos = await PedidoFilaModel.find({ status: { $ne: 'pronto' } })
      .sort({ data_pedido: 1 })
      .limit(10)
      .exec();

    return pedidos.map((pedido) => pedido.toValueObject());
  }

  async atualizarStatus(id: string, status: Status): Promise<PedidoFila<Item>> {
    const pedido = await PedidoFilaModel.findById(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    pedido.status = status;
    await pedido.save();
    return pedido.toValueObject();
  }

  async remover(id: string): Promise<boolean> {
    const pedido = await PedidoFilaModel.findById(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    await pedido.deleteOne();
    return true;
  }
}

export default PedidoFilaRepository;
