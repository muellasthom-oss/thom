import client from './client.js'

export const fetchPromotions = async () => {
  const { data } = await client.get('/promotions')
  return data
}

export const createPromotion = async (payload) => {
  const { data } = await client.post('/promotions', payload)
  return data
}

export const updatePromotion = async (id, payload) => {
  const { data } = await client.put(`/promotions/${id}`, payload)
  return data
}

export const deletePromotion = async (id) => {
  await client.delete(`/promotions/${id}`)
}
