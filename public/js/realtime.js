const socket = io();

// renderizar lista de productos
socket.on('productList', (products) => {
const list = document.getElementById('productList');
list.innerHTML = '';
products.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.title} - $${p.price}`;
    list.appendChild(li);
});
});

// enviar producto nuevo
document.getElementById('productForm').addEventListener('submit', (e) => {
e.preventDefault();
const data = {
    title: e.target.title.value,
    price: Number(e.target.price.value),
};
socket.emit('newProduct', data);
e.target.reset();
});

// eliminar producto
document.getElementById('deleteForm').addEventListener('submit', (e) => {
e.preventDefault();
const id = Number(e.target.id.value);
socket.emit('deleteProduct', id);
e.target.reset();
});
