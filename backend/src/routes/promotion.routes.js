import { Router } from 'express'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import {
  getPromotions,
  createPromotionHandler,
  updatePromotionHandler,
  deletePromotionHandler
} from '../controllers/promotion.controller.js'

const router = Router()

router.get('/', authenticate, requireRole('admin'), getPromotions)
router.post('/', authenticate, requireRole('admin'), createPromotionHandler)
router.put('/:id', authenticate, requireRole('admin'), updatePromotionHandler)
router.delete('/:id', authenticate, requireRole('admin'), deletePromotionHandler)

export default router
