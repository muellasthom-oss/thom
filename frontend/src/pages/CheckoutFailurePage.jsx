import { Link } from 'react-router-dom'

const CheckoutFailurePage = () => (
  <div className='py-24 flex flex-col items-center text-center space-y-6'>
    <div className='w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/40'>
      <span className='material-icons text-red-400 text-4xl'>error</span>
    </div>
    <div className='space-y-3 max-w-xl'>
      <h1 className='text-3xl font-bold text-white'>Pagamento não concluído</h1>
      <p className='text-white/70'>
        Não identificamos a confirmação do pagamento. Você pode tentar novamente ou entrar em contato com nosso time de suporte.
      </p>
    </div>
    <div className='flex gap-3'>
      <Link to='/checkout' className='px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/80 transition'>
        Tentar novamente
      </Link>
      <Link to='/suporte' className='px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white/80 hover:text-white transition'>
        Falar com suporte
      </Link>
    </div>
  </div>
)

export default CheckoutFailurePage
