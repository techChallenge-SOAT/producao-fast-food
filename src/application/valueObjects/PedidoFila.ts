import Item from './Item';
import { Status } from './Pedido';
import { v4 as uuidv4 } from 'uuid';

function generateFriendlyID(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let friendlyID = '';
  for (let i = 0; i < 8; i++) {
    friendlyID += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return friendlyID;
}

function getEstimatedPreparationTime<Item>(itens: Array<Item>): number {
  return itens.length * 5;
}

export default class PedidoFila<Item> {
  id?: string;
  queue_id: string;
  cliente_cpf: string;
  status: Status;
  pedido_id: string;
  data_pedido: Date;
  itens: Array<Item>;
  tempo_estimado_preparo_min: number;
  constructor(
    cliente_cpf: string,
    data_pedido: Date,
    status: Status,
    pedido_id: string,
    itens: Array<Item>,
  ) {
    this.id = uuidv4();
    this.queue_id = generateFriendlyID();
    this.cliente_cpf = cliente_cpf;
    this.data_pedido = data_pedido;
    this.status = status;
    this.pedido_id = pedido_id;
    this.itens = itens;
    this.tempo_estimado_preparo_min = getEstimatedPreparationTime<Item>(itens);
  }
}

export interface PedidoFilaDTO {
  cliente_cpf: string;
  status: Status;
  pedido_id: string;
  data_pedido: Date;
  itens: Array<Item>;
}
