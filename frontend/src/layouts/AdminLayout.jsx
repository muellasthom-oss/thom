import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import { useEffect } from 'react'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/afiliados', label: 'Afiliados' },
  { to: '/admin/promocoes', label: 'Promoções' },
  { to: '/admin/relatorios', label: 'Relatórios' },
  { to: '/admin/configuracoes', label: 'Configurações' }
]

const AdminLayout = () => {
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/admin/login')
  }, [token, navigate])

  if (!token) return null

  return (
    <div className='min-h-screen bg-slate-950 text-white grid grid-cols-[240px_1fr]'>
      <aside className='bg-black/40 border-r border-white/5 p-6 space-y-8'>
        <Link to='/' className='flex items-center gap-3'>
          <span className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-xl font-black'>H</span>
          <div>
            <p className='font-semibold leading-tight'>Painel</p>
            <p className='text-xs text-white/60'>Howstore Digital</p>
          </div>
        </Link>
        <nav className='space-y-2'>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className='flex flex-col'>
        <header className='border-b border-white/5 px-8 py-4 flex items-center justify-between bg-black/30'>
          <div>
            <p className='text-sm text-white/50'>Bem-vindo de volta</p>
            <p className='font-semibold'>{user?.name}</p>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
            className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm'
          >
            Sair
          </button>
        </header>
        <main className='flex-1 overflow-y-auto p-8 bg-slate-950/80'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
