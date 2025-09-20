import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// Vista estática con productos
router.get('/home', async (req, res) => {
const products = await productManager.getProducts();
res.render('home', { products });
});

// Vista en tiempo real
router.get('/realtimeproducts', async (req, res) => {
const products = await productManager.getProducts();
res.render('realTimeProducts', { products });
});

export default router;
