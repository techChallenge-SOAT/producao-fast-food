import { app } from './adapters/http/server';
import connectDatabase from './adapters/database/connector';
import { pollQueue } from './application/useCases/ProcessarFilaPedido';

pollQueue().catch(error => {
  console.error('Error starting the SQS polling:', error);
});

const port = process.env.PORT || 4000;
connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
  });
});
