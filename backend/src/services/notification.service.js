import nodemailer from 'nodemailer'
import { get } from '../utils/db-helpers.js'

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null

const fallbackSend = async (message) => {
  console.log('Email notification (mock):', message.subject)
  console.log(message.text)
}

export const sendEmail = async (message) => {
  if (!transporter) {
    return fallbackSend(message)
  }
  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'store@example.com',
    ...message
  })
}

export const sendOrderConfirmationEmail = async (order, payload) => {
  const user = order.user_id
    ? get('SELECT email, name FROM users WHERE id = :id', { id: order.user_id })
    : null
  const recipient = user?.email || order.customer_email
  if (!recipient) return

  await sendEmail({
    to: recipient,
    subject: `Confirmação do pedido ${order.id}`,
    text: `Obrigado pela compra!\n\nItens:\n${payload.downloads
      .map((item) => `- ${item.product}`)
      .join('\n')}\n\nTotal pago: R$ ${(order.total_cents / 100).toFixed(2)}.`,
    html: `<h1>Obrigado pela compra!</h1><p>Segue o conteúdo digital:</p><ul>${payload.downloads
      .map((item) => `<li><strong>${item.product}</strong></li>`)
      .join('')}</ul>`
  })
}

export const sendDigitalDeliveryEmail = async (userId, payload) => {
  const user = get('SELECT email, name FROM users WHERE id = :id', { id: userId })
  if (!user) return
  await sendEmail({
    to: user.email,
    subject: 'Seu produto digital está disponível',
    text: payload.downloads
      .map((item) => `${item.product}: ${item.content}`)
      .join('\n'),
    html: `<h1>Entrega de Produto</h1>${payload.downloads
      .map((item) => `<p><strong>${item.product}</strong>: ${item.content}</p>`)
      .join('')}`
  })
}
