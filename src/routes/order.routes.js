import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/myorders', authenticate, getUserOrders);
router.get('/', authenticate, admin, getAllOrders);
router.put('/:id', authenticate, admin, updateOrderStatus);

export default router;