import mercadopago from 'mercadopago';
import { getProductById } from '@/lib/products';

const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (ACCESS_TOKEN) {
  mercadopago.configure({ access_token: ACCESS_TOKEN });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  if (!ACCESS_TOKEN) {
    return res.status(500).json({ message: 'MERCADO_PAGO_ACCESS_TOKEN não configurado.' });
  }

  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'productId é obrigatório.' });
  }

  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado.' });
  }

  if (!product.available) {
    return res.status(400).json({ message: 'Produto indisponível para compra.' });
  }

  try {
    const origin = req.headers.origin || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const preference = await mercadopago.preferences.create({
      items: [
        {
          id: product.id,
          title: product.title,
          description: product.description,
          quantity: 1,
          currency_id: product.currency === 'R$' ? 'BRL' : 'USD',
          unit_price: Number(product.price)
        }
      ],
      back_urls: {
        success: `${origin}/success?product=${product.id}`,
        failure: `${origin}/failure?product=${product.id}`,
        pending: `${origin}/pending?product=${product.id}`
      },
      auto_return: 'approved',
      metadata: {
        downloadUrl: product.downloadUrl
      }
    });

    return res.status(200).json({ init_point: preference.body.init_point, id: preference.body.id });
  } catch (error) {
    console.error('Mercado Pago error', error);
    return res.status(500).json({ message: 'Erro ao criar preferência de pagamento.' });
  }
}
