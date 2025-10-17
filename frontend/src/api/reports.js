import client from './client.js'

export const fetchSalesReport = async (params) => {
  const { data } = await client.get('/reports/sales', { params })
  return data
}

export const fetchFinanceReport = async () => {
  const { data } = await client.get('/reports/finance')
  return data
}
