import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, admin, createProduct);
router.put('/:id', authenticate, admin, updateProduct);
router.delete('/:id', authenticate, admin, deleteProduct);

export default router;
