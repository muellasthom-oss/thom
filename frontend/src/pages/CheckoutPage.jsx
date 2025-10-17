import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { checkout } from '../api/orders.js'
import useCartStore from '../store/cartStore.js'
import { formatCurrency } from '../utils/formatters.js'

const CheckoutPage = () => {
  const { items, subtotal, promoCode, affiliateCode, clear } = useCartStore()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preference, setPreference] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          variation_id: item.variation?.id || null,
          quantity: item.quantity
        })),
        promoCode,
        affiliateCode,
        customer: {
          name: data.name,
          email: data.email
        }
      }
      const response = await checkout(payload)
      setPreference(response.preference)
      clear()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='py-12 grid lg:grid-cols-[1.3fr_0.7fr] gap-12'>
      <div className='space-y-6'>
        <h1 className='text-3xl font-bold text-white'>Finalizar compra</h1>
        <p className='text-sm text-white/60'>Revise seus dados para receber o produto digital automaticamente após o pagamento.</p>

        <form onSubmit={handleSubmit(onSubmit)} className='bg-card/70 border border-white/10 rounded-3xl p-8 space-y-6'>
          <div>
            <label className='text-sm text-white/60 block mb-2'>Nome completo</label>
            <input
              {...register('name', { required: true })}
              className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none'
            />
          </div>
          <div>
            <label className='text-sm text-white/60 block mb-2'>E-mail para entrega</label>
            <input
              {...register('email', { required: true })}
              type='email'
              className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none'
            />
          </div>
          <button
            type='submit'
            disabled={loading || items.length === 0}
            className='w-full py-4 rounded-2xl bg-primary hover:bg-primary/80 font-semibold text-white transition disabled:opacity-50'
          >
            {loading ? 'Processando...' : 'Gerar pagamento via Mercado Pago'}
          </button>
          {error && <p className='text-sm text-red-400'>{error}</p>}
        </form>

        {preference && (
          <div className='bg-green-500/10 border border-green-500/30 rounded-3xl p-6 space-y-3'>
            <h2 className='text-lg font-semibold text-green-300'>Pedido gerado com sucesso!</h2>
            <p className='text-sm text-green-200'>
              Utilize o link abaixo para concluir o pagamento no ambiente seguro do Mercado Pago.
            </p>
            <a
              href={preference.init_point || preference.sandbox_init_point}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-sm text-green-100'
            >
              Abrir checkout seguro
            </a>
          </div>
        )}
      </div>

      <aside className='bg-white/5 border border-white/5 rounded-3xl p-8 space-y-5 h-fit'>
        <h2 className='text-xl font-semibold text-white'>Resumo da compra</h2>
        <div className='space-y-4 text-sm text-white/70'>
          {items.length === 0 ? (
            <p>Seu carrinho está vazio. Adicione itens para continuar.</p>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.variation?.id || 'default'}`} className='flex justify-between gap-3'>
                <div>
                  <p className='text-white font-medium'>{item.product.name}</p>
                  {item.variation && <p className='text-xs text-white/50'>Variante: {item.variation.name}</p>}
                  <p className='text-xs text-white/40'>Quantidade: {item.quantity}</p>
                </div>
                <span className='text-white/80'>
                  {formatCurrency((item.product.price_cents + (item.variation?.price_modifier_cents || 0)) * item.quantity)}
                </span>
              </div>
            ))
          )}
        </div>
        <div className='border-t border-white/10 pt-4 text-sm text-white/60 space-y-2'>
          <div className='flex justify-between text-white'>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal())}</span>
          </div>
          {promoCode && (
            <div className='flex justify-between'>
              <span>Cupom aplicado</span>
              <span className='text-secondary'>{promoCode}</span>
            </div>
          )}
          {affiliateCode && (
            <div className='flex justify-between'>
              <span>Afiliado</span>
              <span className='text-secondary'>{affiliateCode}</span>
            </div>
          )}
        </div>
        <p className='text-xs text-white/50'>Após a confirmação de pagamento você receberá os códigos no e-mail informado.</p>
      </aside>
    </div>
  )
}

export default CheckoutPage
