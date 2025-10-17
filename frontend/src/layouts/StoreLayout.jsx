import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useCartStore from '../store/cartStore.js'
import CartDrawer from '../components/CartDrawer.jsx'

const navigation = [
  { label: 'Início', to: '/' },
  { label: 'Destaques', to: '/#destaques' },
  { label: 'Categorias', to: '/#categorias' }
]

const StoreLayout = () => {
  const [open, setOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-background text-white'>
      <header className='sticky top-0 z-40 border-b border-white/5 backdrop-blur bg-background/80'>
        <div className='max-w-6xl mx-auto flex items-center justify-between px-4 py-4'>
          <Link to='/' className='flex items-center gap-3'>
            <span className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-xl font-black'>H</span>
            <div>
              <p className='font-semibold leading-tight'>Howstore Digital</p>
              <p className='text-xs text-white/60'>Produtos oficiais e entrega instantânea</p>
            </div>
          </Link>
          <nav className='hidden md:flex items-center gap-6'>
            {navigation.map((item) => (
              <Link key={item.label} to={item.to} className='text-sm text-white/70 hover:text-white transition'>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/checkout')}
              className='hidden md:block px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-sm'
            >
              Finalizar compra
            </button>
            <button
              onClick={() => setOpen(true)}
              className='relative w-11 h-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center hover:bg-primary/30 transition'
            >
              <span className='material-icons text-primary'>shopping_cart</span>
              {cartItems.length > 0 && (
                <span className='absolute -top-1 -right-1 bg-secondary text-black text-xs font-semibold px-1.5 rounded-full'>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-4 pb-20'>
        <Outlet />
      </main>

      <footer className='border-t border-white/5 bg-black/30'>
        <div className='max-w-6xl mx-auto px-4 py-6 text-sm text-white/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <p>© {new Date().getFullYear()} Howstore Digital. Todos os direitos reservados.</p>
          <div className='flex gap-4'>
            <Link to='/politica' className='hover:text-white'>Política de Privacidade</Link>
            <Link to='/suporte' className='hover:text-white'>Suporte</Link>
          </div>
        </div>
      </footer>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default StoreLayout
