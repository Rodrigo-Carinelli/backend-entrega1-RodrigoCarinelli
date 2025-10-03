/*
import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');


router.post('/', async (req, res) => {
const newCart = await cartManager.createCart();
res.status(201).json(newCart);
});


router.get('/:cid', async (req, res) => {
const cart = await cartManager.getCartById(req.params.cid);
if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
res.json(cart.products);
});


router.post('/:cid/product/:pid', async (req, res) => {
const { cid, pid } = req.params;
const updatedCart = await cartManager.addProductToCart(cid, pid);
if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
res.json(updatedCart);
});

export default router;
*/
import { Router } from 'express';
import Cart from '../models/Cart.js';

const router = Router();

// Crear carrito
router.post('/', async (req, res) => {
const cart = await Cart.create({ products: [] });
res.status(201).json(cart);
});

// Obtener carrito con populate
router.get('/:cid', async (req, res) => {
const cart = await Cart.findById(req.params.cid).populate('products.product');
res.json(cart);
});

// Agregar producto
router.post('/:cid/product/:pid', async (req, res) => {
const cart = await Cart.findById(req.params.cid);
const existing = cart.products.find(p => p.product.toString() === req.params.pid);

if (existing) {
    existing.quantity++;
} else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
}

await cart.save();
res.json(cart);
});

// DELETE producto específico
router.delete('/:cid/products/:pid', async (req, res) => {
const cart = await Cart.findById(req.params.cid);
cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
await cart.save();
res.json(cart);
});

// PUT actualizar todo el carrito
router.put('/:cid', async (req, res) => {
const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
res.json(cart);
});

// PUT actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
const cart = await Cart.findById(req.params.cid);
const item = cart.products.find(p => p.product.toString() === req.params.pid);
if (item) item.quantity = req.body.quantity;
await cart.save();
res.json(cart);
});

// DELETE vaciar carrito
router.delete('/:cid', async (req, res) => {
const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
res.json(cart);
});

export default router;
