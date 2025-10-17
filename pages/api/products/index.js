import { nanoid } from 'nanoid';
import { getProducts, createProduct } from '@/lib/products';

const ADMIN_TOKEN = process.env.ADMIN_PASSWORD;

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return ADMIN_TOKEN && token === ADMIN_TOKEN;
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const products = getProducts();
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const {
      title,
      description,
      price,
      imageUrl,
      downloadUrl,
      category,
      tags = [],
      available = true,
      currency = 'R$'
    } = req.body;

    if (!title || !description || price === undefined || price === null || !imageUrl || !downloadUrl || !category) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice)) {
      return res.status(400).json({ message: 'Preço inválido.' });
    }

    const product = {
      id: nanoid(),
      title,
      description,
      price: numericPrice,
      imageUrl,
      downloadUrl,
      category,
      tags,
      available,
      currency
    };

    const created = createProduct(product);
    return res.status(201).json(created);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
