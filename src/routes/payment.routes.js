import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createPaymentIntent, stripeWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/webhook', stripeWebhook);

export default router;