import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../../config/swagger.json';
import mongoose from 'mongoose';
import PedidoFilaRepository from '../database/repositories/pedido_fila';
import { PedidoFilaDTO } from '../../application/valueObjects/PedidoFila';
import AdicionaPedidoAFila from '../../application/useCases/adicionaPedidoAFila';
import AtualizaStatusPedido from '../../application/useCases/atualizaStatusPedido';
import PedidosClient from '../pedidos/client';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.post('/pedido', async (req, res) => {
  try {
    const repo = new PedidoFilaRepository();
    if (!req.body.status) {
      return res.status(400).json({ message: 'Status parameter is required' });
    }

    if (!req.body.id) {
      return res
        .status(400)
        .json({ message: 'Pedido ID parameter is required' });
    }

    if (!req.body.data_pedido || !req.body.itens) {
      return res
        .status(400)
        .json({ message: 'Data Pedido and Itens parameters are required' });
    }

    if (req.body.itens.length === 0) {
      return res
        .status(400)
        .json({ message: 'Itens parameter must have at least one item' });
    }

    const pedido: PedidoFilaDTO = {
      cliente_cpf: req.body.cliente_cpf,
      status: req.body.status,
      id: req.body.id,
      data_pedido: req.body.data_pedido,
      itens: req.body.itens,
    };
    const useCase = new AdicionaPedidoAFila(repo);
    const created = await useCase.execute(pedido);
    return res.status(200).json(created);
  } catch (error) {
    console.error(error);
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
    if (!req.body || !req.body.status) {
      return res.status(400).json({ message: 'Status parameter is required' });
    }
    const repo = new PedidoFilaRepository();
    const status = req.body.status;
    const service = new PedidosClient();
    const useCase = new AtualizaStatusPedido(repo, service);
    const pedidoAtualizado = await useCase.execute(req.params.id, status);
    return res.status(200).json(pedidoAtualizado);
  } catch (error) {
    //TODO: melhorar isso aqui colocando exceptions customizadas
    if (/Status inválido/.test((error as Error).message)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    if ((error as Error).message === 'Pedido não encontrado') {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.status(500).json({ message: 'Erro ao atualizar pedido' });
  }
});

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(500)
      .json({ message: 'Microsserviço de Produção Fora do ar' });
  }
  return res.status(200).json({ message: 'Microsserviço de Produção' });
});

export { app };
