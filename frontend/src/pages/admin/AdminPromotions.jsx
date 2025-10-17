import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  fetchPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../../api/promotions.js'

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([])
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10
    }
  })

  const load = async () => {
    const data = await fetchPromotions()
    setPromotions(data)
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      discount_value: Number(data.discount_value)
    }
    if (editing) {
      await updatePromotion(editing.id, payload)
    } else {
      await createPromotion(payload)
    }
    setEditing(null)
    reset({ code: '', name: '', description: '', discount_type: 'percentage', discount_value: 10 })
    load()
  }

  const onEdit = (promotion) => {
    setEditing(promotion)
    reset({
      code: promotion.code,
      name: promotion.name,
      description: promotion.description,
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-white'>Promoções e cupons</h1>
          <p className='text-sm text-white/60'>Crie campanhas personalizadas e acompanhe o desempenho de cupons de desconto.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='bg-white/5 border border-white/10 rounded-3xl p-6 grid md:grid-cols-5 gap-4 text-sm'>
        <div>
          <label className='text-xs text-white/50 block mb-1'>Código</label>
          <input {...register('code', { required: true })} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none uppercase' />
        </div>
        <div className='md:col-span-2'>
          <label className='text-xs text-white/50 block mb-1'>Nome</label>
          <input {...register('name', { required: true })} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
        </div>
        <div>
          <label className='text-xs text-white/50 block mb-1'>Tipo</label>
          <select {...register('discount_type')} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none'>
            <option value='percentage'>%</option>
            <option value='fixed'>Valor</option>
          </select>
        </div>
        <div>
          <label className='text-xs text-white/50 block mb-1'>Valor</label>
          <input {...register('discount_value', { required: true })} type='number' step='0.01' className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
        </div>
        <div className='md:col-span-5'>
          <label className='text-xs text-white/50 block mb-1'>Descrição</label>
          <textarea {...register('description')} rows='2' className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
        </div>
        <div className='md:col-span-5 flex justify-end gap-3'>
          {editing && (
            <button type='button' onClick={() => { setEditing(null); reset() }} className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20'>Cancelar</button>
          )}
          <button type='submit' className='px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold'>Salvar promoção</button>
        </div>
      </form>

      <div className='grid gap-4'>
        {promotions.map((promotion) => (
          <div key={promotion.id} className='bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm'>
            <div>
              <p className='text-white font-semibold'>{promotion.name}</p>
              <p className='text-white/50'>Código: {promotion.code}</p>
              <p className='text-white/60'>Tipo: {promotion.discount_type === 'percentage' ? `${promotion.discount_value}%` : `R$ ${promotion.discount_value}`}</p>
            </div>
            <div className='flex gap-3'>
              <button onClick={() => onEdit(promotion)} className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20'>Editar</button>
              <button onClick={() => { deletePromotion(promotion.id).then(load) }} className='px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30'>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPromotions
