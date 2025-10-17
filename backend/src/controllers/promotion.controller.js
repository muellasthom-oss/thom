import { z } from 'zod'
import {
  listPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../services/promotion.service.js'

const baseSchema = z.object({
  code: z.string().min(3),
  name: z.string(),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  usage_limit: z.number().int().positive().optional()
})

export const getPromotions = (req, res) => {
  res.json(listPromotions())
}

export const createPromotionHandler = (req, res) => {
  try {
    const payload = baseSchema.parse(req.body)
    const promotion = createPromotion(payload)
    res.status(201).json(promotion)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updatePromotionHandler = (req, res) => {
  try {
    const payload = baseSchema.parse(req.body)
    const promotion = updatePromotion(req.params.id, payload)
    res.json(promotion)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deletePromotionHandler = (req, res) => {
  deletePromotion(req.params.id)
  res.status(204).end()
}
