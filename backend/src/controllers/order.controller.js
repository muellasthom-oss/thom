import { z } from 'zod'
import {
  listOrders,
  getOrderById,
  initiateCheckout,
  handlePaymentWebhook,
  updateOrderStatus
} from '../services/order.service.js'

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string(),
      variation_id: z.string().nullable().optional(),
      quantity: z.number().int().min(1)
    })
  ),
  promoCode: z.string().optional(),
  affiliateCode: z.string().optional(),
  customer: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      identification: z.any().optional()
    })
    .optional(),
  currency: z.string().default('BRL')
})

export const getOrders = (req, res) => {
  const orders = listOrders()
  res.json(orders)
}

export const getOrder = (req, res) => {
  const order = getOrderById(req.params.id)
  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }
  res.json(order)
}

export const checkout = async (req, res) => {
  try {
    const payload = checkoutSchema.parse(req.body)
    const result = await initiateCheckout({
      ...payload,
      userId: req.user?.id
    })
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const webhook = async (req, res) => {
  try {
    const result = await handlePaymentWebhook(req.body.data || req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateStatus = (req, res) => {
  const schema = z.object({ status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']) })
  try {
    const payload = schema.parse(req.body)
    const order = updateOrderStatus(req.params.id, payload.status)
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
