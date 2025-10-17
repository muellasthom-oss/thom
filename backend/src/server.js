import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import fs from 'node:fs'

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import affiliateRoutes from './routes/affiliate.routes.js'
import promotionRoutes from './routes/promotion.routes.js'
import reportRoutes from './routes/report.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import { notFound, errorHandler } from './middlewares/error.middleware.js'
import { createUser } from './services/auth.service.js'
import { listProducts, createProduct } from './services/product.service.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(helmet())

const uploadsDir = path.join(process.cwd(), 'backend', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/affiliates', affiliateRoutes)
app.use('/api/promotions', promotionRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/settings', settingsRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  seed()
})

const seed = () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    try {
      createUser({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' })
      console.log('Admin user created or already exists')
    } catch (error) {
      console.log('Admin user seed:', error.message)
    }

    const products = listProducts()
    if (products.length === 0) {
      createProduct({
        name: 'Cartão Presente Steam R$50',
        summary: 'Entrega automática em segundos',
        description: 'Código digital válido na Steam Brasil.',
        price_cents: 5000,
        currency: 'BRL',
        image_url: 'https://via.placeholder.com/400x220.png?text=Steam+Gift',
        digital_content: 'STEAM-CODE-EXEMPLO-1234',
        metadata: { tags: ['steam', 'gift-card'], category: 'Gift Cards' },
        is_active: true
      })
      console.log('Seed product created')
    }
  } catch (error) {
    console.error('Seed error', error)
  }
}
