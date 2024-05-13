import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../../config/swagger.json';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//TODO: implementar rota de adição de pedido à fila
app.post('/pedido', (req, res) => {
  res.status(201).send();
});

//TODO: implementar rota de consulta de pedidos na fila
app.get('/pedido', (req, res) => {
  res.status(200).send();
});

//TODO implementar rota de atualização de status de pedido específico
app.put('/pedido/:id', (req, res) => {
  res.status(200).send();
});

app.get('/health', (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).send('Microsserviço de Produção Fora do ar');
  }
  return res.status(200).send('Microsserviço de Produção');
});

export { app };
