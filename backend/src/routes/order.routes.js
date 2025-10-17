import { Router } from 'express'
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.middleware.js'
import {
  getOrders,
  getOrder,
  checkout,
  webhook,
  updateStatus
} from '../controllers/order.controller.js'

const router = Router()

router.get('/', authenticate, requireRole('admin'), getOrders)
router.get('/:id', authenticate, requireRole('admin'), getOrder)
router.post('/checkout', optionalAuth, checkout)
router.post('/mercadopago/webhook', webhook)
router.patch('/:id/status', authenticate, requireRole('admin'), updateStatus)

export default router
