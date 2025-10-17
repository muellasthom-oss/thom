import { z } from 'zod'
import {
  listProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/product.service.js'

const variationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price_modifier_cents: z.number().int().default(0),
  stock: z.number().int().nullable().optional(),
  metadata: z.record(z.any()).optional()
})

const productSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  price_cents: z.number().int().min(0),
  currency: z.string().default('BRL'),
  image_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
  digital_content: z.string().optional(),
  stock: z.number().int().nullable().optional(),
  metadata: z.record(z.any()).optional(),
  is_active: z.boolean().optional(),
  variations: z.array(variationSchema).optional()
})

export const getProducts = (req, res) => {
  const products = listProducts({ activeOnly: req.query.active === 'true' })
  res.json(products)
}

export const getProduct = (req, res) => {
  const product = getProductBySlug(req.params.slug)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json(product)
}

export const getProductAdmin = (req, res) => {
  const product = getProductById(req.params.id)
  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }
  res.json(product)
}

export const createProductHandler = (req, res) => {
  try {
    const payload = productSchema.parse(req.body)
    const product = createProduct(payload)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateProductHandler = (req, res) => {
  try {
    const payload = productSchema.partial().parse(req.body)
    const product = updateProduct(req.params.id, payload)
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteProductHandler = (req, res) => {
  deleteProduct(req.params.id)
  res.status(204).end()
}
