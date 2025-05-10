import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes'
import paymentRoutes from './routes/paymentRoutes';
import bodyParser from 'body-parser';
import { stripeWebhookController } from './controllers/PaymentControllers/stripeWebhookController';

dotenv.config();

const app = express();
app.use(cors());
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhookController);
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
