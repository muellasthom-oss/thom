import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../../api/products.js'
import { formatCurrency } from '../../utils/formatters.js'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const load = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        summary: data.summary,
        description: data.description,
        price_cents: Math.round(Number(data.price) * 100),
        image_url: data.image_url,
        is_active: true
      }
      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        await createProduct(payload)
      }
      setShowModal(false)
      setEditing(null)
      reset()
      load()
    } catch (error) {
      console.error(error)
    }
  }

  const onEdit = (product) => {
    setEditing(product)
    reset({
      name: product.name,
      summary: product.summary,
      description: product.description,
      price: product.price_cents / 100,
      image_url: product.image_url
    })
    setShowModal(true)
  }

  const onCreate = () => {
    setEditing(null)
    reset({ name: '', summary: '', description: '', price: 0, image_url: '' })
    setShowModal(true)
  }

  const onDelete = async (product) => {
    if (!window.confirm(`Deseja remover ${product.name}?`)) return
    await deleteProduct(product.id)
    load()
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-white'>Produtos</h1>
          <p className='text-sm text-white/60'>Gerencie seu catálogo digital, estoque e conteúdo entregue automaticamente.</p>
        </div>
        <button onClick={onCreate} className='px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 text-sm font-semibold'>
          Novo produto
        </button>
      </div>

      <div className='grid gap-4'>
        {products.map((product) => (
          <div key={product.id} className='bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <div className='w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden'>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className='w-full h-full object-cover' />
                ) : (
                  <span className='text-primary font-semibold text-xl'>{product.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className='text-lg font-semibold text-white'>{product.name}</h3>
                <p className='text-sm text-white/60 max-w-xl'>{product.summary}</p>
                <span className='text-sm text-secondary font-semibold'>{formatCurrency(product.price_cents)}</span>
              </div>
            </div>
            <div className='flex gap-2 text-sm'>
              <button onClick={() => onEdit(product)} className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20'>Editar</button>
              <button onClick={() => onDelete(product)} className='px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30'>Remover</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6'>
          <div className='w-full max-w-xl bg-slate-950 border border-white/10 rounded-3xl p-8 space-y-5'>
            <h2 className='text-xl font-semibold text-white'>{editing ? 'Editar produto' : 'Novo produto'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <label className='text-xs text-white/50 block mb-1'>Nome</label>
                <input {...register('name', { required: true })} className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
              </div>
              <div>
                <label className='text-xs text-white/50 block mb-1'>Resumo</label>
                <input {...register('summary')} className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
              </div>
              <div>
                <label className='text-xs text-white/50 block mb-1'>Descrição</label>
                <textarea {...register('description')} rows='4' className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
              </div>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs text-white/50 block mb-1'>Preço (R$)</label>
                  <input {...register('price', { required: true })} type='number' step='0.01' className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
                </div>
                <div>
                  <label className='text-xs text-white/50 block mb-1'>Imagem (URL)</label>
                  <input {...register('image_url')} className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
                </div>
              </div>
              <div className='flex justify-end gap-3'>
                <button type='button' onClick={() => setShowModal(false)} className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20'>Cancelar</button>
                <button type='submit' className='px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 font-semibold text-sm'>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
