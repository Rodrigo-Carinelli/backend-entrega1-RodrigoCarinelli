/*
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
*/

import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const productManager = new ProductManager('./src/data/products.json');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // archivos estáticos (JS del frontend)

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Servidor
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});

// Socket.io
const io = new Server(httpServer);
io.on('connection', async (socket) => {
  console.log('🟢 Cliente conectado');

  // enviar productos al conectarse
  const products = await productManager.getProducts();
  socket.emit('productList', products);

  // escuchar producto nuevo
  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit('productList', updatedProducts);
  });

  // escuchar eliminación de producto
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit('productList', updatedProducts);
  });
});
