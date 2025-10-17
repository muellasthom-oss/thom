import client from './client.js'

export const checkout = async (payload) => {
  const { data } = await client.post('/orders/checkout', payload)
  return data
}

export const fetchOrders = async () => {
  const { data } = await client.get('/orders')
  return data
}

export const updateOrderStatus = async (id, status) => {
  const { data } = await client.patch(`/orders/${id}/status`, { status })
  return data
}
