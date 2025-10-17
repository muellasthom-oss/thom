import { v4 as uuid } from 'uuid'
import { all, get, run, transaction } from '../utils/db-helpers.js'
import { getPromotionByCode, incrementPromotionUsage } from './promotion.service.js'
import { getAffiliateByCode } from './affiliate.service.js'
import { listProducts, getProductById } from './product.service.js'
import { sendDigitalDeliveryEmail, sendOrderConfirmationEmail } from './notification.service.js'
import { createPreference, verifyPaymentStatus } from './payment.service.js'

const calculateItemTotal = (product, variation, quantity) => {
  const base = product.price_cents
  const modifier = variation ? variation.price_modifier_cents || 0 : 0
  return (base + modifier) * quantity
}

const applyPromotion = (subtotal, promotion) => {
  if (!promotion) return { discount: 0, total: subtotal }
  const now = new Date()
  if (promotion.starts_at && new Date(promotion.starts_at) > now) {
    return { discount: 0, total: subtotal }
  }
  if (promotion.ends_at && new Date(promotion.ends_at) < now) {
    return { discount: 0, total: subtotal }
  }
  if (promotion.usage_limit && promotion.usage_count >= promotion.usage_limit) {
    return { discount: 0, total: subtotal }
  }

  let discount = 0
  if (promotion.discount_type === 'percentage') {
    discount = Math.round(subtotal * (promotion.discount_value / 100))
  } else {
    discount = Math.round(promotion.discount_value * 100)
  }
  const total = Math.max(subtotal - discount, 0)
  return { discount, total }
}

export const listOrders = () => {
  return all(
    `SELECT o.*, COALESCE(o.customer_name, u.name) AS customer_name, COALESCE(o.customer_email, u.email) AS customer_email,
            a.code AS affiliate_code
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN affiliates a ON a.id = o.affiliate_id
     ORDER BY o.created_at DESC`
  )
}

export const getOrderById = (id) => {
  const order = get('SELECT * FROM orders WHERE id = :id', { id })
  if (!order) return null
  const items = all('SELECT * FROM order_items WHERE order_id = :order_id', { order_id: id })
  return { ...order, items }
}

export const initiateCheckout = async ({
  userId,
  items,
  promoCode,
  affiliateCode,
  customer,
  currency = 'BRL'
}) => {
  const products = listProducts()
  const resolvedItems = []
  let subtotal = 0

  items.forEach((item) => {
    const product = products.find((p) => p.id === item.product_id)
    if (!product) {
      throw new Error('Product not found')
    }
    if (!product.is_active) {
      throw new Error('Product inactive')
    }
    const variation = product.variations.find((v) => v.id === item.variation_id)
    subtotal += calculateItemTotal(product, variation, item.quantity)
    resolvedItems.push({ product, variation, quantity: item.quantity })
  })

  const promotion = promoCode ? getPromotionByCode(promoCode.toUpperCase()) : null
  const { discount, total } = applyPromotion(subtotal, promotion)
  const affiliate = affiliateCode ? getAffiliateByCode(affiliateCode) : null

  const orderId = uuid()
  const createdAt = new Date().toISOString()

  transaction(() => {
    run(
      `INSERT INTO orders (
        id, user_id, affiliate_id, status, total_cents, currency,
        payment_provider, payment_status, promo_code, customer_name, customer_email, created_at, updated_at
      ) VALUES (
        :id, :user_id, :affiliate_id, :status, :total_cents, :currency,
        :payment_provider, :payment_status, :promo_code, :customer_name, :customer_email, :created_at, :updated_at
      )`,
      {
        id: orderId,
        user_id: userId || null,
        affiliate_id: affiliate ? affiliate.id : null,
        status: 'pending',
        total_cents: total,
        currency,
        payment_provider: 'mercadopago',
        payment_status: 'pending',
        promo_code: promotion ? promotion.code : null,
        customer_name: customer?.name || null,
        customer_email: customer?.email || null,
        created_at: createdAt,
        updated_at: createdAt
      }
    )

    resolvedItems.forEach(({ product, variation, quantity }) => {
      const lineTotal = calculateItemTotal(product, variation, quantity)
      run(
        `INSERT INTO order_items (
          id, order_id, product_id, variation_id, quantity, unit_price_cents, total_cents, payload
        ) VALUES (
          :id, :order_id, :product_id, :variation_id, :quantity, :unit_price_cents, :total_cents, :payload
        )`,
        {
          id: uuid(),
          order_id: orderId,
          product_id: product.id,
          variation_id: variation ? variation.id : null,
          quantity,
          unit_price_cents: variation ? product.price_cents + (variation.price_modifier_cents || 0) : product.price_cents,
          total_cents: lineTotal,
          payload: JSON.stringify({ product_name: product.name, variation: variation ? variation.name : null })
        }
      )
    })
  })()

  if (promotion) {
    incrementPromotionUsage(promotion.code)
  }

  const preference = await createPreference({
    orderId,
    items: resolvedItems.map(({ product, variation, quantity }) => ({
      title: variation ? `${product.name} - ${variation.name}` : product.name,
      quantity,
      unit_price: (variation ? product.price_cents + (variation.price_modifier_cents || 0) : product.price_cents) / 100,
      currency_id: currency
    })),
    total: total / 100,
    customer
  })

  return { orderId, preference }
}

export const handlePaymentWebhook = async ({ id: paymentId }) => {
  const verification = await verifyPaymentStatus(paymentId)
  if (!verification) {
    return { success: false }
  }
  const { orderId, status, transactionAmount } = verification
  const order = getOrderById(orderId)
  if (!order) {
    return { success: false }
  }
  const updatedAt = new Date().toISOString()
  run(
    `UPDATE orders SET payment_status = :payment_status, status = :status, payment_reference = :payment_reference, updated_at = :updated_at
     WHERE id = :id`,
    {
      id: orderId,
      payment_status: status,
      status: status === 'approved' ? 'completed' : 'failed',
      payment_reference: paymentId,
      updated_at: updatedAt
    }
  )

  if (status === 'approved') {
    fulfillDigitalOrder(order)
  }

  return { success: true, amount: transactionAmount }
}

const fulfillDigitalOrder = (order) => {
  const payload = { downloads: [] }
  const items = all('SELECT * FROM order_items WHERE order_id = :order_id', { order_id: order.id })
  items.forEach((item) => {
    const product = getProductById(item.product_id)
    payload.downloads.push({
      product: product.name,
      content: product.digital_content || order.download_payload || 'Conteúdo digital a ser enviado.'
    })
  })
  const orderTotal = items.reduce((sum, item) => sum + item.total_cents, 0) / 100

  if (order.affiliate_id) {
    const affiliate = get('SELECT commission_rate FROM affiliates WHERE id = :id', { id: order.affiliate_id })
    if (affiliate) {
      const commission = orderTotal * affiliate.commission_rate
      run(
        `UPDATE affiliates SET total_sales = total_sales + :sales, total_commission = total_commission + :commission
         WHERE id = :id`,
        { id: order.affiliate_id, sales: orderTotal, commission }
      )
    }
  }

  run(
    `UPDATE orders SET download_payload = :download_payload, status = 'completed', updated_at = :updated_at
     WHERE id = :id`,
    {
      id: order.id,
      download_payload: JSON.stringify(payload),
      updated_at: new Date().toISOString()
    }
  )

  if (order.user_id) {
    sendDigitalDeliveryEmail(order.user_id, payload)
  }
  sendOrderConfirmationEmail(order, payload)
}

export const updateOrderStatus = (id, status) => {
  const now = new Date().toISOString()
  run('UPDATE orders SET status = :status, updated_at = :updated_at WHERE id = :id', { id, status, updated_at: now })
  const order = getOrderById(id)
  if (status === 'completed') {
    fulfillDigitalOrder(order)
  }
  return order
}
