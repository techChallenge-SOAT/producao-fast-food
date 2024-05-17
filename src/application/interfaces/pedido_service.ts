interface IPedidoService {
  atualizaStatusPedido(id: string, status: string): void;
}

export default IPedidoService;
