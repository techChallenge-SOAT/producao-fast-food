const url = process.env.PEDIDOS_URI || 'http://localhost:3000';

class PedidosClient {
  async atualizaStatusPedido(id: string, status: string): Promise<unknown> {
    const statusUpdate = {
      status: status,
    };

    try {
      const response = await fetch(`${url}/pedidos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdate),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default PedidosClient;
