import IPedidoService from '../interfaces/pedido_service';
import { IRepository } from '../interfaces/repository';
import Item from '../valueObjects/Item';
import { Status } from '../valueObjects/Pedido';
import PedidoFila from '../valueObjects/PedidoFila';

class AtualizaStatusPedido {
  repository: IRepository<PedidoFila<Item>>;
  pedidoService: IPedidoService;
  constructor(
    repository: IRepository<PedidoFila<Item>>,
    pedidoService: IPedidoService,
  ) {
    this.repository = repository;
    this.pedidoService = pedidoService;
  }
  async execute(id: string, status: string): Promise<PedidoFila<Item>> {
    const updated = await this.repository.atualizarStatus(id, status as Status);

    //essa promise não tem await para não bloquear o fluxo de resposta
    this.pedidoService.atualizaStatusPedido(id, updated.status);

    return updated;
  }
}

export default AtualizaStatusPedido;
