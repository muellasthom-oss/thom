import { useState } from 'react';

export default function ProductCard({ product, onPurchase }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!onPurchase) return;
    try {
      setLoading(true);
      await onPurchase(product);
    } finally {
      setLoading(false);
    }
  };

  const priceLabel = `${product.currency} ${Number(product.price).toFixed(2)}`;

  return (
    <article className="card">
      <img src={product.imageUrl} alt={product.title} />
      <div className="card-body">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3>{product.title}</h3>
            <p style={{ margin: '0.3rem 0 0', color: 'rgba(226,232,240,0.75)', fontSize: '0.9rem' }}>{product.description}</p>
          </div>
          <span className="badge">{product.category}</span>
        </header>
        <div className="tag-list">
          {product.tags?.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="price">{priceLabel}</span>
          <span className={`status-pill ${product.available ? '' : 'unavailable'}`}>
            <span
              style={{
                display: 'inline-block',
                width: '0.5rem',
                height: '0.5rem',
                borderRadius: '999px',
                background: product.available ? '#22c55e' : '#ef4444'
              }}
            />
            {product.available ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
        <button
          onClick={handlePurchase}
          disabled={!product.available || loading}
          style={{ opacity: !product.available ? 0.5 : 1 }}
        >
          {loading ? 'Conectando...' : 'Comprar agora'}
        </button>
      </div>
    </article>
  );
}
