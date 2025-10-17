import { get, run } from '../utils/db-helpers.js'

export const getSettings = () => {
  const settings = get('SELECT * FROM store_settings WHERE id = 1')
  if (!settings) {
    return {
      branding: {},
      payment: {},
      seo: {}
    }
  }
  return {
    branding: settings.branding ? JSON.parse(settings.branding) : {},
    payment: settings.payment ? JSON.parse(settings.payment) : {},
    seo: settings.seo ? JSON.parse(settings.seo) : {}
  }
}

export const updateSettings = (input) => {
  const existing = get('SELECT * FROM store_settings WHERE id = 1')
  const payload = {
    branding: input.branding ? JSON.stringify(input.branding) : existing?.branding || JSON.stringify({}),
    payment: input.payment ? JSON.stringify(input.payment) : existing?.payment || JSON.stringify({}),
    seo: input.seo ? JSON.stringify(input.seo) : existing?.seo || JSON.stringify({}),
    updated_at: new Date().toISOString()
  }
  if (existing) {
    run(
      `UPDATE store_settings SET branding = :branding, payment = :payment, seo = :seo, updated_at = :updated_at WHERE id = 1`,
      payload
    )
  } else {
    run(
      `INSERT INTO store_settings (id, branding, payment, seo, updated_at)
       VALUES (1, :branding, :payment, :seo, :updated_at)`,
      payload
    )
  }
  return getSettings()
}
