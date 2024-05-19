const url = process.env.PEDIDOS_URI || 'http://localhost:3000/pedidos';

class PedidosClient {
  async atualizaStatusPedido(id: string, status: string): Promise<void> {
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

      const responseData = await response.json();
      console.log('pedidos client', responseData);
    } catch (error) {
      console.error('Error:', error);
      // Vai engolir o erro e não vai lançar para o controller
      // throw error;
    }
  }
}

export default PedidosClient;
