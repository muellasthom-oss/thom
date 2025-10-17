import { Link } from 'react-router-dom'

const Hero = () => (
  <section className='relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-primary/30 via-background to-black/60 p-10 mb-10'>
    <div className='max-w-xl space-y-6'>
      <span className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 border border-white/10'>
        <span className='material-icons text-secondary text-base'>bolt</span>
        Entrega instantânea garantida
      </span>
      <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
        Seus jogos, gift cards e serviços digitais favoritos em um só lugar.
      </h1>
      <p className='text-white/70 text-lg'>
        Explore uma vitrine premium inspirada na howstore.gg com curadoria especial e promoções exclusivas. Atendimento humanizado e pagamento via Mercado Pago com segurança máxima.
      </p>
      <div className='flex flex-wrap gap-3'>
        <Link to='/#destaques' className='px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/80 transition'>
          Ver ofertas em destaque
        </Link>
        <Link to='/checkout' className='px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white/80 hover:text-white transition'>
          Acompanhar pedidos
        </Link>
      </div>
    </div>
    <div className='absolute -right-20 bottom-0 w-96 h-96 bg-primary/30 blur-3xl rounded-full pointer-events-none' />
  </section>
)

export default Hero
