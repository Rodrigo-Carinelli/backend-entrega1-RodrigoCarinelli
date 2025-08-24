import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

// POST crear carrito
router.post('/', async (req, res) => {
const newCart = await cartManager.createCart();
res.status(201).json(newCart);
});

// GET productos de un carrito
router.get('/:cid', async (req, res) => {
const cart = await cartManager.getCartById(req.params.cid);
if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
res.json(cart.products);
});

// POST agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
const { cid, pid } = req.params;
const updatedCart = await cartManager.addProductToCart(cid, pid);
if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
res.json(updatedCart);
});

export default router;
