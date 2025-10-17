import { Router } from 'express'
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.middleware.js'
import {
  getProducts,
  getProduct,
  getProductAdmin,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler
} from '../controllers/product.controller.js'

const router = Router()

router.get('/', optionalAuth, getProducts)
router.get('/slug/:slug', optionalAuth, getProduct)

router.get('/:id', authenticate, requireRole('admin'), getProductAdmin)
router.post('/', authenticate, requireRole('admin'), createProductHandler)
router.put('/:id', authenticate, requireRole('admin'), updateProductHandler)
router.delete('/:id', authenticate, requireRole('admin'), deleteProductHandler)

export default router
