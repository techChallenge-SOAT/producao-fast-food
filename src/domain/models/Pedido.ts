export enum Status {
  Recebido = 'recebido',
  Pago = 'pago',
  Preparacao = 'em preparação',
  Cancelado = 'cancelado',
  Pronto = 'pronto',
  Finalizado = 'finalizado',
}
export default class Pedido {
  id: string;
  cliente_cpf: string;
  data_pedido: Date;
  status: Status;
  constructor(
    id: string,
    cliente_cpf: string,
    data_pedido: Date,
    status: Status,
  ) {
    this.id = id;
    this.cliente_cpf = cliente_cpf;
    this.data_pedido = data_pedido;
    this.status = status;
  }
}
