import { Router } from 'express'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import { salesReport, financeReport } from '../controllers/report.controller.js'

const router = Router()

router.get('/sales', authenticate, requireRole('admin'), salesReport)
router.get('/finance', authenticate, requireRole('admin'), financeReport)

export default router
