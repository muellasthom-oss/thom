import { getProductById, updateProduct, deleteProduct } from '@/lib/products';

const ADMIN_TOKEN = process.env.ADMIN_PASSWORD;

function isAuthorized(req) {
  const token = req.headers['x-admin-token'];
  return ADMIN_TOKEN && token === ADMIN_TOKEN;
}

export default function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  if (method === 'GET') {
    const product = getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    return res.status(200).json(product);
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  if (method === 'PUT') {
    const updates = { ...req.body };
    if (updates.price !== undefined) {
      const numericPrice = Number(updates.price);
      if (!Number.isFinite(numericPrice)) {
        return res.status(400).json({ message: 'Preço inválido.' });
      }
      updates.price = numericPrice;
    }
    const updated = updateProduct(id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    return res.status(200).json(updated);
  }

  if (method === 'DELETE') {
    const deleted = deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end('Method Not Allowed');
}
