import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductBySlug } from '../api/products.js'
import useCartStore from '../store/cartStore.js'
import { formatCurrency } from '../utils/formatters.js'

const ProductPage = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductBySlug(slug)
        setProduct(data)
        if (data.variations?.length > 0) {
          setSelectedVariation(data.variations[0])
        }
      } catch (error) {
        console.error(error)
      }
    }
    load()
  }, [slug])

  if (!product) {
    return <p className='text-white/60 text-sm mt-10'>Carregando produto...</p>
  }

  const price = product.price_cents + (selectedVariation?.price_modifier_cents || 0)

  return (
    <div className='grid lg:grid-cols-[1.1fr_0.9fr] gap-12 py-10'>
      <div className='space-y-6'>
        <div className='relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center h-80'>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className='h-60 object-contain drop-shadow-2xl' />
          ) : (
            <div className='w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center text-primary/80 text-3xl font-semibold'>
              {product.name.charAt(0)}
            </div>
          )}
        </div>
        <div className='bg-card/60 border border-white/5 rounded-3xl p-8 space-y-4'>
          <h2 className='text-xl font-semibold text-white'>Descrição detalhada</h2>
          <p className='text-white/60 leading-relaxed whitespace-pre-wrap'>{product.description}</p>
          {product.metadata?.features && (
            <ul className='grid md:grid-cols-2 gap-3 text-sm text-white/70'>
              {product.metadata.features.map((feature) => (
                <li key={feature} className='flex items-start gap-2'>
                  <span className='material-icons text-secondary text-base mt-1'>check</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <section className='bg-white/5 border border-white/5 rounded-3xl p-8 space-y-3'>
          <h3 className='font-semibold text-white'>Avaliações verificadas</h3>
          <p className='text-sm text-white/60'>
            Integração pronta para conectar com seu provedor de reviews favorito. Exiba depoimentos reais e conquiste confiança.
          </p>
          <div className='flex gap-6 text-sm text-white/70'>
            <div>
              <p className='text-3xl font-bold text-secondary'>4.9</p>
              <p>Classificação média</p>
            </div>
            <div className='flex-1 space-y-1'>
              {[5, 4, 3].map((stars) => (
                <div key={stars} className='flex items-center gap-2'>
                  <span>{'★'.repeat(stars)}</span>
                  <div className='h-2 bg-white/10 rounded-full flex-1'>
                    <div className='h-2 bg-secondary rounded-full' style={{ width: `${90 - stars * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <aside className='bg-card/80 border border-white/10 rounded-3xl p-8 space-y-6 h-fit'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold text-white'>{product.name}</h1>
          <p className='text-white/50 text-sm'>{product.summary}</p>
        </div>
        <div className='text-4xl font-black text-secondary'>{formatCurrency(price)}</div>
        {product.variations?.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm text-white/60'>Escolha a versão</p>
            <div className='grid grid-cols-2 gap-3'>
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation)}
                  className={`rounded-2xl border px-4 py-3 text-sm text-left transition ${
                    selectedVariation?.id === variation.id
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <p className='font-medium'>{variation.name}</p>
                  {variation.price_modifier_cents !== 0 && (
                    <p className='text-xs text-white/60'>
                      {variation.price_modifier_cents > 0 ? '+' : ''}{' '}
                      {formatCurrency(variation.price_modifier_cents)}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className='w-10 h-10 rounded-full bg-white/10 hover:bg-white/20'
          >
            −
          </button>
          <span className='px-4 py-2 rounded-lg bg-white/10'>{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className='w-10 h-10 rounded-full bg-white/10 hover:bg-white/20'
          >
            +
          </button>
        </div>
        <button
          onClick={() => addItem(product, selectedVariation, quantity)}
          className='w-full py-4 rounded-2xl bg-primary hover:bg-primary/80 font-semibold text-white shadow-lg shadow-primary/30 transition'
        >
          Adicionar ao carrinho
        </button>
        <div className='space-y-3 text-sm text-white/60'>
          <p className='flex items-center gap-2'><span className='material-icons text-secondary text-base'>lock</span> Pagamento seguro via Mercado Pago</p>
          <p className='flex items-center gap-2'><span className='material-icons text-secondary text-base'>rocket</span> Entrega automática e suporte em tempo real</p>
          <p className='flex items-center gap-2'><span className='material-icons text-secondary text-base'>workspace_premium</span> Produto com garantia vitalícia</p>
        </div>
      </aside>
    </div>
  )
}

export default ProductPage
