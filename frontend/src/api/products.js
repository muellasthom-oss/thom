import client from './client.js'

export const fetchProducts = async () => {
  const { data } = await client.get('/products')
  return data
}

export const fetchProductBySlug = async (slug) => {
  const { data } = await client.get(`/products/slug/${slug}`)
  return data
}

export const createProduct = async (payload) => {
  const { data } = await client.post('/products', payload)
  return data
}

export const updateProduct = async (id, payload) => {
  const { data } = await client.put(`/products/${id}`, payload)
  return data
}

export const deleteProduct = async (id) => {
  await client.delete(`/products/${id}`)
}
