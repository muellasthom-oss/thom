import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  fetchAffiliates,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate
} from '../../api/affiliates.js'

const AdminAffiliates = () => {
  const [affiliates, setAffiliates] = useState([])
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm({ defaultValues: { commission_rate: 0.1 } })

  const load = async () => {
    const data = await fetchAffiliates()
    setAffiliates(data)
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateAffiliate(editing.id, { commission_rate: Number(data.commission_rate) })
      } else {
        await createAffiliate({ user_id: data.user_id, commission_rate: Number(data.commission_rate) })
      }
      setEditing(null)
      reset({ commission_rate: 0.1 })
      load()
    } catch (error) {
      console.error(error)
    }
  }

  const onEdit = (affiliate) => {
    setEditing(affiliate)
    reset({ commission_rate: affiliate.commission_rate })
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-white'>Afiliados</h1>
          <p className='text-sm text-white/60'>Gerencie parceiros, comissões e links exclusivos para impulsionar vendas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='bg-white/5 border border-white/10 rounded-3xl p-6 grid md:grid-cols-4 gap-4 text-sm'>
        {!editing && (
          <div className='md:col-span-2'>
            <label className='text-xs text-white/50 block mb-1'>ID do usuário</label>
            <input {...register('user_id', { required: !editing })} className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
          </div>
        )}
        <div className='md:col-span-1'>
          <label className='text-xs text-white/50 block mb-1'>Comissão</label>
          <input {...register('commission_rate', { required: true })} type='number' step='0.01' min='0' max='1' className='w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none' />
        </div>
        <div className='md:col-span-1 flex items-end'>
          <button type='submit' className='w-full py-2 rounded-xl bg-primary hover:bg-primary/80 text-white font-semibold'>
            {editing ? 'Atualizar' : 'Cadastrar'} afiliado
          </button>
        </div>
      </form>

      <div className='grid gap-4'>
        {affiliates.map((affiliate) => (
          <div key={affiliate.id} className='bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm'>
            <div>
              <p className='text-white font-semibold'>{affiliate.user_name}</p>
              <p className='text-white/60'>{affiliate.user_email}</p>
              <p className='text-white/40'>Código: {affiliate.code}</p>
            </div>
            <div className='flex items-center gap-4'>
              <p className='text-secondary font-semibold'>Comissão: {(affiliate.commission_rate * 100).toFixed(1)}%</p>
              <button onClick={() => onEdit(affiliate)} className='px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20'>Editar</button>
              <button onClick={() => { deleteAffiliate(affiliate.id).then(load) }} className='px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30'>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminAffiliates
