import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { stripeWebhook } from './controllers/payment.controller.js';

const app = express();

// CONNECT TO MONGODB DATABASE
connectDB();

// MIDDLEWARES
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.post('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// HEALTH CHECK ROUTE
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'ORBISTORE API RUNNING' });
});

export default app;