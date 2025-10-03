/*
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');


router.get('/', async (req, res) => {
const products = await productManager.getProducts();
res.json(products);
});


router.get('/:pid', async (req, res) => {
const product = await productManager.getProductById(req.params.pid);
if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
res.json(product);
});


router.post('/', async (req, res) => {
const newProduct = await productManager.addProduct(req.body);
res.status(201).json(newProduct);
});


router.put('/:pid', async (req, res) => {
const updated = await productManager.updateProduct(req.params.pid, req.body);
if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });res.json(updated);
});


router.delete('/:pid', async (req, res) => {
const deleted = await productManager.deleteProduct(req.params.pid);
if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
res.json({ message: 'Producto eliminado' });
});

export default router;
*/

import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = {};

    if (query) {
    if (query === 'available') filter.status = true;
    else filter.category = query;
    }

    const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const result = await Product.paginate ? 
    await Product.paginate(filter, options) : 
      await Product.find(filter).limit(options.limit).skip((options.page - 1) * options.limit).sort(options.sort);

    res.json({
    status: 'success',
    payload: result.docs || result,
    totalPages: result.totalPages || Math.ceil(await Product.countDocuments(filter) / options.limit),
    prevPage: result.prevPage || (options.page > 1 ? options.page - 1 : null),
    nextPage: result.nextPage || (options.page + 1),
    page: result.page || options.page,
    hasPrevPage: result.hasPrevPage || (options.page > 1),
      hasNextPage: result.hasNextPage || (options.page * options.limit < await Product.countDocuments(filter)),
    prevLink: result.hasPrevPage ? `/api/products?page=${options.page - 1}&limit=${options.limit}` : null,
    nextLink: result.hasNextPage ? `/api/products?page=${options.page + 1}&limit=${options.limit}` : null
    });
} catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
}
});

// POST crear producto
router.post('/', async (req, res) => {
try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

// PUT actualizar producto
router.put('/:pid', async (req, res) => {
try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    res.json(updated);
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

// DELETE eliminar producto
router.delete('/:pid', async (req, res) => {
try {
    await Product.findByIdAndDelete(req.params.pid);
    res.json({ message: 'Producto eliminado' });
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

export default router;

