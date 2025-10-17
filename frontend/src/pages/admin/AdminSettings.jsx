import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { fetchSettings, updateSettings } from '../../api/settings.js'

const AdminSettings = () => {
  const { register, handleSubmit, reset } = useForm()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await fetchSettings()
      reset({
        branding_logo: data.branding?.logo || '',
        branding_color_primary: data.branding?.colors?.primary || '#6C5CE7',
        hero_title: data.branding?.hero?.title || 'Seu hub de jogos e gift cards',
        hero_subtitle: data.branding?.hero?.subtitle || 'Entrega instantânea garantida',
        mercadopago_public_key: data.payment?.mercadopago_public_key || '',
        seo_title: data.seo?.title || 'Howstore Digital',
        seo_description: data.seo?.description || ''
      })
    }
    load()
  }, [reset])

  const onSubmit = async (data) => {
    setSaving(true)
    setMessage(null)
    try {
      await updateSettings({
        branding: {
          logo: data.branding_logo,
          colors: { primary: data.branding_color_primary },
          hero: {
            title: data.hero_title,
            subtitle: data.hero_subtitle
          }
        },
        payment: {
          mercadopago_public_key: data.mercadopago_public_key
        },
        seo: {
          title: data.seo_title,
          description: data.seo_description
        }
      })
      setMessage('Configurações atualizadas com sucesso!')
    } catch (error) {
      setMessage(`Erro ao salvar: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='space-y-6 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-semibold text-white'>Configurações</h1>
        <p className='text-sm text-white/60'>Personalize a identidade visual, integrações e SEO da sua loja digital.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 text-sm'>
        <section className='space-y-3'>
          <h2 className='text-white font-semibold'>Branding</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='text-xs text-white/50 block mb-1'>Logo (URL)</label>
              <input {...register('branding_logo')} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
            </div>
            <div>
              <label className='text-xs text-white/50 block mb-1'>Cor primária</label>
              <input {...register('branding_color_primary')} type='color' className='w-full h-11 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='text-xs text-white/50 block mb-1'>Título do Hero</label>
              <input {...register('hero_title')} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
            </div>
            <div>
              <label className='text-xs text-white/50 block mb-1'>Subtítulo</label>
              <input {...register('hero_subtitle')} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
            </div>
          </div>
        </section>

        <section className='space-y-3'>
          <h2 className='text-white font-semibold'>Pagamentos</h2>
          <div>
            <label className='text-xs text-white/50 block mb-1'>Mercado Pago Public Key</label>
            <input {...register('mercadopago_public_key')} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
          </div>
        </section>

        <section className='space-y-3'>
          <h2 className='text-white font-semibold'>SEO</h2>
          <div>
            <label className='text-xs text-white/50 block mb-1'>Título</label>
            <input {...register('seo_title')} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
          </div>
          <div>
            <label className='text-xs text-white/50 block mb-1'>Descrição</label>
            <textarea {...register('seo_description')} rows='3' className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
          </div>
        </section>

        <div className='flex justify-end gap-3 items-center'>
          {message && <p className='text-xs text-white/50'>{message}</p>}
          <button type='submit' disabled={saving} className='px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 disabled:opacity-50 text-white font-semibold'>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
