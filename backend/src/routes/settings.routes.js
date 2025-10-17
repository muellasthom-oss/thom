import { Router } from 'express'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import { getStoreSettings, updateStoreSettings } from '../controllers/settings.controller.js'

const router = Router()

router.get('/', getStoreSettings)
router.put('/', authenticate, requireRole('admin'), updateStoreSettings)

export default router
