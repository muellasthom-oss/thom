import client from './client.js'

export const fetchSettings = async () => {
  const { data } = await client.get('/settings')
  return data
}

export const updateSettings = async (payload) => {
  const { data } = await client.put('/settings', payload)
  return data
}
