import { Router } from 'express'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import {
  getAffiliates,
  createAffiliateHandler,
  updateAffiliateHandler,
  deleteAffiliateHandler
} from '../controllers/affiliate.controller.js'

const router = Router()

router.get('/', authenticate, requireRole('admin'), getAffiliates)
router.post('/', authenticate, requireRole('admin'), createAffiliateHandler)
router.put('/:id', authenticate, requireRole('admin'), updateAffiliateHandler)
router.delete('/:id', authenticate, requireRole('admin'), deleteAffiliateHandler)

export default router
