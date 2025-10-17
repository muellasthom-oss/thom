import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const initialForm = {
  title: '',
  description: '',
  price: '',
  currency: 'R$',
  imageUrl: '',
  downloadUrl: '',
  category: '',
  tags: '',
  available: true
};

export default function Admin() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [filter, setFilter] = useState('');

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('thom-admin-token') : null;
    if (saved) {
      setToken(saved);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProducts();
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setStatus(null);
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    const payload = await response.json();
    if (response.ok) {
      setToken(payload.token);
      window.localStorage.setItem('thom-admin-token', payload.token);
      setPassword('');
      setStatus({ type: 'success', message: 'Autenticado com sucesso.' });
    } else {
      setStatus({ type: 'error', message: payload.message || 'Falha ao autenticar.' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      price: Number(form.price),
      available: Boolean(form.available)
    };

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus({ type: 'error', message: result.message || 'Falha ao salvar produto.' });
      return;
    }

    await fetchProducts();
    setForm(initialForm);
    setEditingId(null);
    setStatus({ type: 'success', message: 'Produto salvo com sucesso.' });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl,
      downloadUrl: product.downloadUrl,
      category: product.category,
      tags: product.tags?.join(', ') ?? '',
      available: product.available
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este produto?')) return;
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': token
      }
    });
    if (!response.ok) {
      const error = await response.json();
      setStatus({ type: 'error', message: error.message || 'Não foi possível remover o produto.' });
      return;
    }
    await fetchProducts();
    setStatus({ type: 'success', message: 'Produto removido.' });
  };

  const filteredProducts = useMemo(() => {
    const term = filter.toLowerCase();
    return products.filter((product) =>
      [product.title, product.category, ...(product.tags || [])].some((text) => text.toLowerCase().includes(term))
    );
  }, [products, filter]);

  const handleLogout = () => {
    setToken('');
    window.localStorage.removeItem('thom-admin-token');
  };

  return (
    <>
      <Head>
        <title>Painel Admin | THOM Store</title>
      </Head>
      <main className="admin-wrapper">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0 }}>Painel administrativo</h1>
            <p style={{ color: 'rgba(226,232,240,0.65)', margin: '0.3rem 0 0' }}>
              Gerencie produtos digitais, controle estoque e links de download.
            </p>
          </div>
          {isAuthenticated && (
            <button onClick={handleLogout} className="secondary">
              Sair
            </button>
          )}
        </header>

        {!isAuthenticated ? (
          <section className="admin-card">
            <h2>Acesso restrito</h2>
            <p style={{ color: 'rgba(226,232,240,0.7)' }}>
              Informe a senha administrativa configurada na variável <code>ADMIN_PASSWORD</code>.
            </p>
            <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem', maxWidth: '360px' }}>
              <label>
                Senha
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <button type="submit">Entrar</button>
            </form>
          </section>
        ) : (
          <>
            <section className="admin-card">
              <h2>{editingId ? 'Editar produto' : 'Cadastrar novo produto'}</h2>
              <form onSubmit={handleSubmit} className="admin-grid">
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label>
                    Nome
                    <input
                      type="text"
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Categoria
                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Preço
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Moeda
                    <select
                      value={form.currency}
                      onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
                    >
                      <option value="R$">Real (BRL)</option>
                      <option value="$">Dólar (USD)</option>
                    </select>
                  </label>
                </div>

                <label>
                  Descrição
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    required
                  />
                </label>

                <label>
                  Tags (separadas por vírgula)
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                  />
                </label>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                  <label>
                    URL da imagem
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    URL de download
                    <input
                      type="url"
                      value={form.downloadUrl}
                      onChange={(event) => setForm((prev) => ({ ...prev, downloadUrl: event.target.value }))}
                      required
                    />
                  </label>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(event) => setForm((prev) => ({ ...prev, available: event.target.checked }))}
                  />
                  Disponível para venda
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
                  {editingId && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        setForm(initialForm);
                        setEditingId(null);
                      }}
                    >
                      Cancelar edição
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Produtos cadastrados</h2>
                <input
                  type="search"
                  placeholder="Filtrar por nome ou tag"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  style={{ maxWidth: '280px' }}
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhum produto cadastrado</h3>
                  <p style={{ color: 'rgba(226,232,240,0.7)' }}>
                    Cadastre produtos digitais para exibi-los na vitrine principal.
                  </p>
                </div>
              ) : (
                <div className="admin-grid">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-row">
                      <img src={product.imageUrl} alt={product.title} />
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ margin: 0 }}>{product.title}</h3>
                            <p style={{ margin: '0.25rem 0', color: 'rgba(226,232,240,0.7)' }}>{product.description}</p>
                            <div className="badge-list">
                              <span className="badge">{product.category}</span>
                              {product.tags?.map((tag) => (
                                <span className="badge" key={tag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong className="price">
                              {product.currency} {Number(product.price).toFixed(2)}
                            </strong>
                            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'rgba(226,232,240,0.7)' }}>
                              {product.available ? 'Disponível' : 'Indisponível'}
                            </p>
                          </div>
                        </div>
                        <div className="admin-actions">
                          <button type="button" onClick={() => handleEdit(product)}>
                            Editar
                          </button>
                          <button type="button" className="delete" onClick={() => handleDelete(product.id)}>
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {status && <div className={`toast ${status.type}`}>{status.message}</div>}
    </>
  );
}
