import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { login, register, enable2FA, verify2FA, updatePassword } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/2fa/enable', authenticate, enable2FA)
router.post('/2fa/verify', authenticate, verify2FA)
router.post('/password', authenticate, updatePassword)

export default router
