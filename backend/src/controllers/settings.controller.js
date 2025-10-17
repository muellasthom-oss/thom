import { z } from 'zod'
import { getSettings, updateSettings } from '../services/settings.service.js'

const schema = z.object({
  branding: z
    .object({
      logo: z.string().url().optional(),
      colors: z.record(z.string()).optional(),
      hero: z.object({ title: z.string().optional(), subtitle: z.string().optional(), background: z.string().optional() }).optional()
    })
    .optional(),
  payment: z.object({
    mercadopago_public_key: z.string().optional(),
    mercadopago_access_token: z.string().optional()
  }).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional()
    })
    .optional()
})

export const getStoreSettings = (req, res) => {
  res.json(getSettings())
}

export const updateStoreSettings = (req, res) => {
  try {
    const payload = schema.parse(req.body)
    const settings = updateSettings(payload)
    res.json(settings)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
