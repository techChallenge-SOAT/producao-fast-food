export default class PedidoFila<Item> {
  pedido_id: string;
  hora_pedido: string;
  itens: Array<Item>;
  status: string;
  tempo_estimado_preparo_min: number;

  constructor(
    pedido_id: string,
    hora_pedido: string,
    itens: Array<Item>,
    status: string,
    tempo_estimado_preparo_min: number,
  ) {
    this.pedido_id = pedido_id;
    this.hora_pedido = hora_pedido;
    this.itens = itens;
    this.status = status;
    this.tempo_estimado_preparo_min = tempo_estimado_preparo_min;
  }
}
