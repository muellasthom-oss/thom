import mercadopago from 'mercadopago'

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || ''

if (accessToken) {
  mercadopago.configure({ access_token: accessToken })
}

export const createPreference = async ({ orderId, items, total, customer }) => {
  const preference = {
    items: items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      currency_id: item.currency_id,
      unit_price: item.unit_price
    })),
    external_reference: orderId,
    payer: customer ? {
      name: customer.name,
      email: customer.email,
      identification: customer.identification || undefined
    } : undefined,
    back_urls: {
      success: process.env.STORE_FRONTEND_URL ? `${process.env.STORE_FRONTEND_URL}/checkout/sucesso` : 'http://localhost:5173/checkout/sucesso',
      failure: process.env.STORE_FRONTEND_URL ? `${process.env.STORE_FRONTEND_URL}/checkout/falha` : 'http://localhost:5173/checkout/falha'
    },
    auto_return: 'approved'
  }

  if (!accessToken) {
    return {
      id: `pref-${orderId}`,
      init_point: `${process.env.STORE_FRONTEND_URL || 'http://localhost:5173'}/checkout/sucesso?mock=true`,
      sandbox_init_point: `${process.env.STORE_FRONTEND_URL || 'http://localhost:5173'}/checkout/sucesso?mock=true`,
      items: preference.items,
      total
    }
  }

  try {
    const response = await mercadopago.preferences.create(preference)
    return response.body
  } catch (error) {
    console.error('Mercado Pago preference error', error.message)
    return {
      id: `pref-${orderId}`,
      init_point: `${process.env.STORE_FRONTEND_URL || 'http://localhost:5173'}/checkout/sucesso?fallback=true`,
      sandbox_init_point: `${process.env.STORE_FRONTEND_URL || 'http://localhost:5173'}/checkout/sucesso?fallback=true`,
      items: preference.items,
      total
    }
  }
}

export const verifyPaymentStatus = async (paymentId) => {
  if (!accessToken) {
    return {
      orderId: paymentId,
      status: 'approved',
      transactionAmount: 0
    }
  }
  try {
    const response = await mercadopago.payment.findById(paymentId)
    if (!response || !response.body) {
      return null
    }
    const payment = response.body
    return {
      orderId: payment.external_reference,
      status: payment.status,
      transactionAmount: payment.transaction_amount
    }
  } catch (error) {
    console.error('Mercado Pago verification failed', error.message)
    return null
  }
}
