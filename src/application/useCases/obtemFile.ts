import { IRepository } from '../interfaces/repository';
import Item from '../valueObjects/Item';
import PedidoFila from '../valueObjects/PedidoFila';

class AdicionaPedidoAFila {
  repository: IRepository<PedidoFila<Item>>;
  constructor(repository: IRepository<PedidoFila<Item>>) {
    this.repository = repository;
  }
  async execute() {
    return await this.repository.listar();
  }
}

export default AdicionaPedidoAFila;
