import client from './client.js'

export const fetchAffiliates = async () => {
  const { data } = await client.get('/affiliates')
  return data
}

export const createAffiliate = async (payload) => {
  const { data } = await client.post('/affiliates', payload)
  return data
}

export const updateAffiliate = async (id, payload) => {
  const { data } = await client.put(`/affiliates/${id}`, payload)
  return data
}

export const deleteAffiliate = async (id) => {
  await client.delete(`/affiliates/${id}`)
}
