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


import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const productManager = new ProductManager('./src/data/products.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});


const io = new Server(httpServer);
io.on('connection', async (socket) => {
  console.log('🟢 Cliente conectado');

  
  const products = await productManager.getProducts();
  socket.emit('productList', products);

  
  socket.on('newProduct', async (data) => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit('productList', updatedProducts);
  });

  
  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit('productList', updatedProducts);
  });
});
*/

import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('📦 Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

