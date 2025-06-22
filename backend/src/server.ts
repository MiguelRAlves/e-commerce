import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { limiter } from './controllers/authController';


import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes'
import paymentRoutes from './routes/paymentRoutes';
import bodyParser from 'body-parser';

import { stripeWebhookController } from './controllers/PaymentControllers/stripeWebhookController';

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://e-commerce-ruddy-two-35.vercel.app'
  ],
  credentials: true
}));
app.use(helmet());
app.use(limiter);
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhookController);
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.use('/api/auth', authRoutes);

app.use('/api', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

app.get("/success", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "success.html"));
});
app.get("/cancel", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "cancel.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
