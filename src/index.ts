import { app } from './adapters/http/server';
import connectDatabase from './adapters/database/connector';

const port = process.env.PORT || 4000;
connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
  });
});
