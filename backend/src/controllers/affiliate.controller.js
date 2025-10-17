import { z } from 'zod'
import {
  listAffiliates,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate
} from '../services/affiliate.service.js'

const createSchema = z.object({
  user_id: z.string(),
  commission_rate: z.number().min(0).max(1).optional()
})

const updateSchema = z.object({
  commission_rate: z.number().min(0).max(1)
})

export const getAffiliates = (req, res) => {
  res.json(listAffiliates())
}

export const createAffiliateHandler = (req, res) => {
  try {
    const payload = createSchema.parse(req.body)
    const affiliate = createAffiliate(payload)
    res.status(201).json(affiliate)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateAffiliateHandler = (req, res) => {
  try {
    const payload = updateSchema.parse(req.body)
    const affiliate = updateAffiliate(req.params.id, payload)
    res.json(affiliate)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteAffiliateHandler = (req, res) => {
  deleteAffiliate(req.params.id)
  res.status(204).end()
}
