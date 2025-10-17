import { useEffect, useState } from 'react'
import { fetchOrders, updateOrderStatus } from '../../api/orders.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'

const statuses = ['pending', 'processing', 'completed', 'failed', 'cancelled']

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await fetchOrders()
      setOrders(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onStatusChange = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status)
      load()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-white'>Pedidos</h1>
        <p className='text-sm text-white/60'>Monitore o fluxo de pedidos, confirmações de pagamento e entregas digitais.</p>
      </div>
      <div className='bg-white/5 border border-white/10 rounded-3xl overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-white/5 text-white/60 uppercase text-xs tracking-wide'>
            <tr>
              <th className='px-4 py-3 text-left'>Pedido</th>
              <th className='px-4 py-3 text-left'>Cliente</th>
              <th className='px-4 py-3 text-left'>Total</th>
              <th className='px-4 py-3 text-left'>Status</th>
              <th className='px-4 py-3 text-left'>Atualizar</th>
              <th className='px-4 py-3 text-left'>Criado em</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/10 text-white/70'>
            {orders.map((order) => (
              <tr key={order.id} className='hover:bg-white/5'>
                <td className='px-4 py-4 font-medium text-white'>{order.id.slice(0, 8)}</td>
                <td className='px-4 py-4'>
                  <p>{order.customer_name || 'Visitante'}</p>
                  <p className='text-xs text-white/40'>{order.customer_email}</p>
                </td>
                <td className='px-4 py-4'>{formatCurrency(order.total_cents)}</td>
                <td className='px-4 py-4'><StatusBadge status={order.status} /></td>
                <td className='px-4 py-4'>
                  <select
                    value={order.status}
                    onChange={(event) => onStatusChange(order, event.target.value)}
                    className='bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-xs'
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className='px-4 py-4'>{formatDate(order.created_at)}</td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan='6' className='px-4 py-8 text-center text-white/40'>Nenhum pedido encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <p className='p-4 text-sm text-white/50'>Carregando pedidos...</p>}
      </div>
    </div>
  )
}

export default AdminOrders
