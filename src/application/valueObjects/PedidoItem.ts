export default class PedidoItem {
  pedido_id: string;
  item_id: string;
  quantidade: number;
  constructor(item_id: string, quantidade: number, pedido_id: string) {
    this.pedido_id = pedido_id;
    this.item_id = item_id;
    this.quantidade = quantidade;
  }
}
