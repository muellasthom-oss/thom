import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatters.js'

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/produtos/${product.slug}`}
      className='group bg-card/60 border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition shadow-lg hover:shadow-primary/40'
    >
      <div className='h-48 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center'>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className='h-32 object-contain drop-shadow-lg transition group-hover:scale-105' />
        ) : (
          <div className='w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary/80 text-lg font-semibold'>
            {product.name.charAt(0)}
          </div>
        )}
      </div>
      <div className='p-5 space-y-3'>
        <div className='flex items-center justify-between text-xs text-white/50'>
          <span>{product.metadata?.category || 'Digital'}</span>
          <span>{product.metadata?.tags?.join(' • ')}</span>
        </div>
        <h3 className='text-lg font-semibold leading-tight text-white group-hover:text-primary transition'>
          {product.name}
        </h3>
        <p className='text-sm text-white/60 line-clamp-2'>{product.summary || product.description}</p>
        <div className='flex items-center justify-between pt-3 border-t border-white/5'>
          <span className='text-xl font-bold text-secondary'>{formatCurrency(product.price_cents)}</span>
          <span className='text-xs text-white/50'>Entrega imediata</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
