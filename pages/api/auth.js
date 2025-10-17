const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { password } = req.body;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ message: 'ADMIN_PASSWORD não configurado.' });
  }

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ token: ADMIN_PASSWORD });
  }

  return res.status(401).json({ message: 'Senha inválida.' });
}
