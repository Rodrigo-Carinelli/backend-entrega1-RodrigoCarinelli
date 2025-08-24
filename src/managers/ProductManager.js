import fs from 'fs';

class ProductManager {
constructor(path) {
    this.path = path;
}

async #readFile() {
    try {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    return JSON.parse(data);
    } catch {
    return [];
    }
}

async #writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
}

async getProducts() {
    return await this.#readFile();
}

async getProductById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id == id);
}

async addProduct(product) {
    const products = await this.#readFile();
    const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    status: true,
    ...product
    };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
}

async updateProduct(id, updatedFields) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedFields, id: products[index].id };
    await this.#writeFile(products);
    return products[index];
}

async deleteProduct(id) {
    const products = await this.#readFile();
    const newProducts = products.filter(p => p.id != id);
    if (products.length === newProducts.length) return null;
    await this.#writeFile(newProducts);
    return true;
}
}

export default ProductManager;
