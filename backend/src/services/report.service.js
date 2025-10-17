import { all, get } from '../utils/db-helpers.js'

export const getSalesReport = ({ startDate, endDate }) => {
  const params = { start: startDate, end: endDate }
  const totals = get(
    `SELECT SUM(total_cents) AS total_cents, COUNT(*) AS total_orders
     FROM orders
     WHERE status = 'completed'
       AND (:start IS NULL OR created_at >= :start)
       AND (:end IS NULL OR created_at <= :end)`,
    params
  )

  const topProducts = all(
    `SELECT p.name, SUM(oi.quantity) AS units_sold, SUM(oi.total_cents) AS revenue
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.status = 'completed'
       AND (:start IS NULL OR o.created_at >= :start)
       AND (:end IS NULL OR o.created_at <= :end)
     GROUP BY p.name
     ORDER BY revenue DESC
     LIMIT 10`,
    params
  )

  const affiliates = all(
    `SELECT a.code, a.total_sales, a.total_commission
     FROM affiliates a
     ORDER BY a.total_sales DESC`
  )

  return {
    totals: {
      total_orders: totals?.total_orders || 0,
      total_revenue_cents: totals?.total_cents || 0
    },
    topProducts,
    affiliates
  }
}

export const getFinanceReport = () => {
  const totals = get(
    `SELECT SUM(total_cents) AS gross_revenue
     FROM orders WHERE status = 'completed'`
  )

  const taxes = (totals?.gross_revenue || 0) * 0.15
  const net = (totals?.gross_revenue || 0) - taxes

  return {
    gross_revenue_cents: totals?.gross_revenue || 0,
    estimated_taxes_cents: Math.round(taxes),
    net_revenue_cents: Math.round(net)
  }
}
