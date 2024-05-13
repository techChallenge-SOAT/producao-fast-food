export default class PedidoItens {
  id?: string;
  pedido_id?: string;
  item_id: number;
  quantidade: number;
  constructor(
    item_id: number,
    quantidade: number,
    pedido_id?: string,
    id?: string,
  ) {
    if (id) {
      this.id = id;
    }
    if (pedido_id) {
      this.pedido_id = pedido_id;
    }
    this.item_id = item_id;
    this.quantidade = quantidade;
  }
}
