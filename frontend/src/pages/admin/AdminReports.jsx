import { useEffect, useState } from 'react'
import { fetchSalesReport, fetchFinanceReport } from '../../api/reports.js'
import { formatCurrency } from '../../utils/formatters.js'

const AdminReports = () => {
  const [sales, setSales] = useState(null)
  const [finance, setFinance] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [salesData, financeData] = await Promise.all([
        fetchSalesReport({}),
        fetchFinanceReport()
      ])
      setSales(salesData)
      setFinance(financeData)
    }
    load()
  }, [])

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold text-white'>Relatórios</h1>
        <p className='text-sm text-white/60'>Insights financeiros, desempenho de produtos e comissões de afiliados.</p>
      </div>

      <div className='grid md:grid-cols-2 gap-5'>
        <div className='bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-white'>Resumo financeiro</h2>
          <ul className='space-y-2 text-sm text-white/70'>
            <li className='flex justify-between'><span>Receita bruta</span><span>{finance ? formatCurrency(finance.gross_revenue_cents) : '—'}</span></li>
            <li className='flex justify-between'><span>Impostos estimados</span><span>{finance ? formatCurrency(finance.estimated_taxes_cents) : '—'}</span></li>
            <li className='flex justify-between text-secondary'><span>Receita líquida</span><span>{finance ? formatCurrency(finance.net_revenue_cents) : '—'}</span></li>
          </ul>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4'>
          <h2 className='text-lg font-semibold text-white'>Top produtos</h2>
          <ul className='space-y-2 text-sm text-white/70'>
            {sales?.topProducts?.length ? (
              sales.topProducts.map((product) => (
                <li key={product.name} className='flex justify-between'>
                  <span>{product.name}</span>
                  <span>{product.units_sold} un.</span>
                </li>
              ))
            ) : (
              <li>Nenhum dado disponível.</li>
            )}
          </ul>
        </div>
      </div>

      <div className='bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4'>
        <h2 className='text-lg font-semibold text-white'>Afiliados</h2>
        <table className='w-full text-sm'>
          <thead className='text-white/50 uppercase text-xs tracking-wide'>
            <tr>
              <th className='text-left py-2'>Código</th>
              <th className='text-left py-2'>Vendas</th>
              <th className='text-left py-2'>Comissões</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/10 text-white/70'>
            {sales?.affiliates?.length ? (
              sales.affiliates.map((affiliate) => (
                <tr key={affiliate.code}>
                  <td className='py-3'>{affiliate.code}</td>
                  <td>{formatCurrency(Math.round(affiliate.total_sales * 100))}</td>
                  <td>{formatCurrency(Math.round(affiliate.total_commission * 100))}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='3' className='py-4 text-center text-white/40'>Nenhum afiliado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminReports
