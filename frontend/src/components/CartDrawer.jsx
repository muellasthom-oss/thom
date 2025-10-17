import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore.js'
import { formatCurrency } from '../utils/formatters.js'

const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const navigate = useNavigate()

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-white/10 shadow-xl transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between px-6 py-4 border-b border-white/10'>
          <h2 className='text-lg font-semibold'>Seu carrinho</h2>
          <button onClick={onClose} className='text-white/60 hover:text-white'>Fechar</button>
        </div>
        <div className='p-6 space-y-4 overflow-y-auto h-[calc(100%-200px)]'>
          {items.length === 0 && (
            <div className='text-center text-white/60 text-sm'>Seu carrinho está vazio.</div>
          )}
          {items.map((item) => (
            <div key={`${item.product.id}-${item.variation?.id || 'default'}`} className='bg-white/5 rounded-xl p-4 space-y-3'>
              <div className='flex justify-between items-start gap-3'>
                <div>
                  <p className='font-semibold'>{item.product.name}</p>
                  {item.variation && (
                    <p className='text-xs text-white/60'>Variante: {item.variation.name}</p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.product.id, item.variation?.id || null)}
                  className='text-xs text-white/60 hover:text-white'
                >
                  Remover
                </button>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.variation?.id || null, Math.max(1, item.quantity - 1))}
                    className='w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center'
                  >
                    −
                  </button>
                  <span className='px-3 py-1 bg-white/10 rounded-lg'>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.variation?.id || null, item.quantity + 1)}
                    className='w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center'
                  >
                    +
                  </button>
                </div>
                <span>{formatCurrency((item.product.price_cents + (item.variation?.price_modifier_cents || 0)) * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className='border-t border-white/10 px-6 py-4 space-y-3'>
          <div className='flex justify-between text-sm text-white/60'>
            <span>Subtotal</span>
            <span className='text-white font-semibold'>{formatCurrency(subtotal())}</span>
          </div>
          <button
            onClick={() => {
              onClose()
              navigate('/checkout')
            }}
            disabled={items.length === 0}
            className='w-full py-3 rounded-xl bg-primary hover:bg-primary/80 transition disabled:opacity-50'
          >
            Ir para checkout
          </button>
          <p className='text-xs text-white/40 text-center'>Pagamento seguro via Mercado Pago.</p>
          <Link to='/suporte' className='block text-center text-xs text-white/50 hover:text-white'>Precisa de ajuda?</Link>
        </div>
      </aside>
    </div>
  )
}

export default CartDrawer
