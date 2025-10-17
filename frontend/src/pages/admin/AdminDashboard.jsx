import { useEffect, useState } from 'react'
import { fetchSalesReport, fetchFinanceReport } from '../../api/reports.js'
import { fetchOrders } from '../../api/orders.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'

const AdminDashboard = () => {
  const [sales, setSales] = useState(null)
  const [finance, setFinance] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [salesData, financeData, ordersData] = await Promise.all([
          fetchSalesReport({}),
          fetchFinanceReport(),
          fetchOrders()
        ])
        setSales(salesData)
        setFinance(financeData)
        setOrders(ordersData.slice(0, 5))
      } catch (error) {
        console.error(error)
      }
    }
    load()
  }, [])

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Visão geral</h1>
        <p className='text-white/60 text-sm'>Acompanhe os indicadores principais da sua loja digital.</p>
      </div>

      <div className='grid md:grid-cols-3 gap-5'>
        <MetricCard
          title='Receita bruta'
          value={finance ? formatCurrency(finance.gross_revenue_cents) : '—'}
          helper='Últimos 30 dias'
        />
        <MetricCard
          title='Pedidos completados'
          value={sales ? sales.totals.total_orders : '—'}
          helper='Total confirmado'
        />
        <MetricCard
          title='Lucro estimado'
          value={finance ? formatCurrency(finance.net_revenue_cents) : '—'}
          helper='Descontados impostos'
        />
      </div>

      <section className='bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-white'>Pedidos recentes</h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='text-white/50 uppercase tracking-wide text-xs'>
              <tr>
                <th className='py-2'>Pedido</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5 text-white/70'>
              {orders.map((order) => (
                <tr key={order.id} className='hover:bg-white/5'>
                  <td className='py-3'>{order.id.slice(0, 8)}</td>
                  <td>{formatCurrency(order.total_cents)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{formatDate(order.created_at)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan='4' className='py-4 text-center text-white/40'>Nenhum pedido recente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

const MetricCard = ({ title, value, helper }) => (
  <div className='bg-card/70 border border-white/10 rounded-3xl p-6 space-y-2'>
    <p className='text-xs text-white/50 uppercase tracking-wide'>{title}</p>
    <p className='text-3xl font-bold text-white'>{value}</p>
    <p className='text-xs text-white/40'>{helper}</p>
  </div>
)

export default AdminDashboard
