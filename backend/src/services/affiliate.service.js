import { v4 as uuid } from 'uuid'
import { all, get, run } from '../utils/db-helpers.js'

export const listAffiliates = () => {
  return all(
    `SELECT a.*, u.name AS user_name, u.email AS user_email
     FROM affiliates a
     JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC`
  )
}

export const createAffiliate = ({ user_id, commission_rate }) => {
  const user = get('SELECT * FROM users WHERE id = :id', { id: user_id })
  if (!user) {
    throw new Error('User not found')
  }
  const code = `${user.name.split(' ')[0] || 'aff'}-${Math.random().toString(36).slice(2, 6)}`.toLowerCase()
  const id = uuid()
  run(
    `INSERT INTO affiliates (id, user_id, code, commission_rate)
     VALUES (:id, :user_id, :code, :commission_rate)`
  , { id, user_id, code, commission_rate: commission_rate || 0.1 })
  return get('SELECT * FROM affiliates WHERE id = :id', { id })
}

export const updateAffiliate = (id, input) => {
  run(
    `UPDATE affiliates SET commission_rate = :commission_rate WHERE id = :id`,
    { id, commission_rate: input.commission_rate }
  )
  return get('SELECT * FROM affiliates WHERE id = :id', { id })
}

export const deleteAffiliate = (id) => {
  run('DELETE FROM affiliates WHERE id = :id', { id })
}

export const getAffiliateByCode = (code) => {
  return get('SELECT * FROM affiliates WHERE code = :code', { code })
}
