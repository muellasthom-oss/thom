import { Link } from 'react-router-dom'

const CheckoutSuccessPage = () => (
  <div className='py-24 flex flex-col items-center text-center space-y-6'>
    <div className='w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40'>
      <span className='material-icons text-green-400 text-4xl'>check_circle</span>
    </div>
    <div className='space-y-3 max-w-xl'>
      <h1 className='text-3xl font-bold text-white'>Pagamento confirmado!</h1>
      <p className='text-white/70'>
        Sua compra foi processada com sucesso. Em instantes você receberá os códigos digitais diretamente no e-mail utilizado no checkout.
      </p>
    </div>
    <Link to='/' className='px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/80 transition'>
      Voltar para a loja
    </Link>
  </div>
)

export default CheckoutSuccessPage
