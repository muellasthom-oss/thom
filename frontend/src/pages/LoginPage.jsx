import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

const LoginPage = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' }
  })
  const navigate = useNavigate()
  const authStore = useAuthStore()
  const [error, setError] = useState(null)

  const onSubmit = async (data) => {
    setError(null)
    try {
      await authStore.login(data.email, data.password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-6'>
      <div className='w-full max-w-md bg-card/80 border border-white/10 rounded-3xl p-10 space-y-8'>
        <div className='space-y-2 text-center'>
          <div className='w-14 h-14 bg-primary rounded-full mx-auto flex items-center justify-center text-xl font-black'>H</div>
          <h1 className='text-2xl font-semibold text-white'>Painel Administrativo</h1>
          <p className='text-sm text-white/60'>Entre com as credenciais para gerenciar a loja digital.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <label className='text-xs text-white/50 block mb-2'>E-mail</label>
            <input
              {...register('email', { required: true })}
              type='email'
              className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none'
            />
          </div>
          <div>
            <label className='text-xs text-white/50 block mb-2'>Senha</label>
            <input
              {...register('password', { required: true })}
              type='password'
              className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/60 outline-none'
            />
          </div>
          <button type='submit' className='w-full py-3 rounded-xl bg-primary hover:bg-primary/80 font-semibold text-white transition'>
            Acessar painel
          </button>
          {error && <p className='text-sm text-red-400 text-center'>{error}</p>}
        </form>
        <p className='text-xs text-white/40 text-center'>Protegido com autenticação JWT e 2FA opcional.</p>
      </div>
    </div>
  )
}

export default LoginPage
