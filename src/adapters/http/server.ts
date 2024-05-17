import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../../config/swagger.json';
import mongoose from 'mongoose';
import PedidoFilaRepository from '../database/repositories/pedido_fila';
import PedidoFila from '../../application/valueObjects/PedidoFila';
import Item from '../../application/valueObjects/Item';
import AdicionaPedidoAFila from '../../application/useCases/adicionaPedidoAFila';
import AtualizaStatusPedido from '../../application/useCases/atualizaStatusPedido';
import PedidosClient from '../pedidos/client';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.post('/pedido', async (req, res) => {
  try {
    const repo = new PedidoFilaRepository();
    const pedido: PedidoFila<Item> = {
      queue_id: req.body.queue_id,
      cliente_cpf: req.body.cliente_cpf,
      status: req.body.status,
      pedido_id: req.body.pedido_id,
      data_pedido: req.body.data_pedido,
      itens: req.body.itens,
      tempo_estimado_preparo_min: req.body.tempo_estimado_preparo_min,
    };
    const useCase = new AdicionaPedidoAFila(repo);
    const created = await useCase.execute(pedido);
    return res.status(200).json(created);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get('/fila', async (req, res) => {
  try {
    const repo = new PedidoFilaRepository();
    const pedidos = await repo.listar();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pedidos na fila' });
  }
});

app.patch('/pedido/:id', async (req, res) => {
  try {
    const repo = new PedidoFilaRepository();
    const status = req.body.status;
    const service = new PedidosClient();
    const useCase = new AtualizaStatusPedido(repo, service);
    const pedidoAtualizado = await useCase.execute(req.params.id, status);
    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar pedido' });
  }
});

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).send('Microsserviço de Produção Fora do ar');
  }
  return res.status(200).send('Microsserviço de Produção');
});

export { app };
