import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', productRoutes)

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
