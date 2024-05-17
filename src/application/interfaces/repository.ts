import { Status } from '../valueObjects/Pedido';

export interface IRepository<T> {
  criar(pedido: T): Promise<T>;
  listar(): Promise<T[]>;
  atualizarStatus(id: string, status: Status): Promise<T>;
  remover(id: string): Promise<boolean>;
}
