import mongoose, { Schema, Document } from 'mongoose';
import { Status } from '../../../application/valueObjects/Pedido';
import type Item from '../../../application/valueObjects/Item';
import type PedidoFila from '../../../application/valueObjects/PedidoFila';

export interface IItem {
  _id: string;
  categoria: string;
  nome: string;
  descricao: string;
  preco_unitario: number;
  toValueObject: () => Item;
}

export interface IPedidoFila extends Document {
  _id: string;
  queue_id: string;
  cliente_cpf: string;
  status: Status;
  pedido_id: string;
  data_pedido: Date;
  itens: Array<IItem>;
  tempo_estimado_preparo_min: number;
  toValueObject: () => PedidoFila<Item>;
}

const ItemModelSchema: Schema = new Schema(
  {
    categoria: { type: String, required: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    preco_unitario: { type: Number, required: true },
  },
  {
    methods: {
      toValueObject(): Item {
        const item: Item = {
          id: this._id as string,
          categoria: this.categoria as string,
          nome: this.nome as string,
          descricao: this.descricao as string,
          preco_unitario: this.preco_unitario as number,
        };
        return item;
      },
    },
  },
);

const PedidoFilaSchema: Schema = new Schema(
  {
    queue_id: { type: String, required: true },
    cliente_cpf: { type: String },
    status: { type: String, default: Status.Recebido },
    pedido_id: { type: String, required: true },
    data_pedido: { type: Date, required: true },
    itens: { type: [ItemModelSchema], required: true },
    tempo_estimado_preparo_min: { type: Number, required: true },
  },
  {
    methods: {
      toValueObject(): PedidoFila<Item> {
        const pedidoFila: PedidoFila<Item> = {
          id: this._id as string,
          queue_id: this.queue_id as string,
          cliente_cpf: this.cliente_cpf as string,
          status: this.status as Status,
          pedido_id: this.pedido_id as string,
          data_pedido: this.data_pedido as Date,
          itens: (this.itens as IItem[]).map((item: IItem) => {
            return item.toValueObject();
          }),
          tempo_estimado_preparo_min: this.tempo_estimado_preparo_min as number,
        };
        return pedidoFila;
      },
    },
  },
);

const PedidoFilaModel = mongoose.model<IPedidoFila>(
  'PedidoFila',
  PedidoFilaSchema,
);

export default PedidoFilaModel;
