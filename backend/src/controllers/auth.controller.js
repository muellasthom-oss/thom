import { z } from 'zod'
import {
  authenticateUser,
  createUser,
  enableTwoFactor,
  verifyTwoFactor,
  changePassword
} from '../services/auth.service.js'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export const register = (req, res) => {
  try {
    const payload = registerSchema.parse(req.body)
    const user = createUser(payload)
    res.status(201).json({ user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const login = (req, res) => {
  try {
    const payload = loginSchema.parse(req.body)
    const result = authenticateUser(payload)
    res.json(result)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

export const enable2FA = (req, res) => {
  try {
    const data = enableTwoFactor(req.user.id)
    res.json(data)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const verify2FA = (req, res) => {
  try {
    const schema = z.object({ token: z.string().min(6) })
    const payload = schema.parse(req.body)
    const data = verifyTwoFactor(req.user.id, payload.token)
    res.json(data)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updatePassword = (req, res) => {
  try {
    const schema = z.object({ password: z.string().min(6) })
    const payload = schema.parse(req.body)
    changePassword(req.user.id, payload.password)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
