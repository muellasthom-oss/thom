import { useMemo, useState } from 'react';
import Head from 'next/head';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/products';

export async function getServerSideProps() {
  const products = getProducts();
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return {
    props: {
      products,
      categories
    }
  };
}

export default function Home({ products, categories }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [feedback, setFeedback] = useState(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Todas' || product.category === activeCategory;
      const matchesTerm =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(term));
      return matchesCategory && matchesTerm;
    });
  }, [products, search, activeCategory]);

  const handlePurchase = async (product) => {
    try {
      setFeedback({ type: 'loading', message: 'Conectando com o Mercado Pago...' });
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: product.id })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Não foi possível iniciar o pagamento.');
      }
      setFeedback(null);
      window.open(payload.init_point, '_blank');
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  return (
    <>
      <Head>
        <title>THOM Store — Produtos Digitais Premium</title>
      </Head>
      <main>
        <header className="header">
          <h1>THOM Store</h1>
          <nav>
            <a href="#categorias">Categorias</a>
            <a href="#produtos">Produtos</a>
            <a href="/admin">Painel Admin</a>
          </nav>
        </header>

        <section className="hero">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Produtos digitais com entrega imediata</h2>
            <p>
              Explore cards, assinaturas e jogos selecionados com curadoria manual. Pagamentos processados com segurança
              pelo Mercado Pago.
            </p>
          </div>
          <div className="hero-actions">
            <button onClick={() => document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' })}>
              Ver catálogo completo
            </button>
            <button
              className="secondary"
              onClick={() => document.getElementById('categorias').scrollIntoView({ behavior: 'smooth' })}
            >
              Ver categorias
            </button>
          </div>
        </section>

        <div className="container" id="catalogo">
          <aside className="sidebar" id="categorias">
            <h2>Categorias</h2>
            <ul>
              <li className={activeCategory === 'Todas' ? 'active' : ''}>
                <button type="button" onClick={() => setActiveCategory('Todas')}>
                  Todas
                </button>
                <small>{products.length}</small>
              </li>
              {categories.map((category) => (
                <li key={category} className={activeCategory === category ? 'active' : ''}>
                  <button type="button" onClick={() => setActiveCategory(category)}>
                    {category}
                  </button>
                  <small>{products.filter((product) => product.category === category).length}</small>
                </li>
              ))}
            </ul>
          </aside>

          <section id="produtos">
            <div className="header" style={{ marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0 }}>Catálogo</h2>
                <p style={{ margin: '0.3rem 0 0', color: 'rgba(226,232,240,0.65)' }}>
                  {filtered.length} produtos encontrados
                </p>
              </div>
              <div className="search-bar">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35m1.68-4.9a6.58 6.58 0 11-13.16 0 6.58 6.58 0 0113.16 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Buscar por nome, tag ou categoria"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhum produto encontrado</h3>
                <p style={{ color: 'rgba(226,232,240,0.7)' }}>Tente ajustar os filtros ou pesquisar por outro termo.</p>
              </div>
            ) : (
              <div className="grid">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onPurchase={handlePurchase} />
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="footer">© {new Date().getFullYear()} THOM Store. Todos os direitos reservados.</footer>
      </main>

      {feedback && (
        <div className={`toast ${feedback.type === 'error' ? 'error' : 'success'}`}>
          {feedback.message}
        </div>
      )}
    </>
  );
}
