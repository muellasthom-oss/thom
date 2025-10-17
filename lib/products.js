import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'products.json');

function ensureDataFile() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  }
}

function readProducts() {
  ensureDataFile();
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

function writeProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
}

export function getProducts() {
  return readProducts();
}

export function getProductById(id) {
  return readProducts().find((product) => product.id === id);
}

export function createProduct(payload) {
  const products = readProducts();
  products.push(payload);
  writeProducts(products);
  return payload;
}

export function updateProduct(id, updates) {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return null;
  }
  products[index] = { ...products[index], ...updates, id };
  writeProducts(products);
  return products[index];
}

export function deleteProduct(id) {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) {
    return false;
  }
  products.splice(index, 1);
  writeProducts(products);
  return true;
}
