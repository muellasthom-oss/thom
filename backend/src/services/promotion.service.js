import { v4 as uuid } from 'uuid'
import { all, get, run } from '../utils/db-helpers.js'

export const listPromotions = () => {
  return all('SELECT * FROM promotions ORDER BY created_at DESC')
}

export const getPromotionByCode = (code) => {
  return get('SELECT * FROM promotions WHERE code = :code', { code })
}

export const createPromotion = (input) => {
  const id = uuid()
  run(
    `INSERT INTO promotions (
      id, code, name, description, discount_type, discount_value,
      starts_at, ends_at, usage_limit
    ) VALUES (
      :id, :code, :name, :description, :discount_type, :discount_value,
      :starts_at, :ends_at, :usage_limit
    )`,
    {
      id,
      code: input.code.toUpperCase(),
      name: input.name,
      description: input.description || null,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      starts_at: input.starts_at || null,
      ends_at: input.ends_at || null,
      usage_limit: input.usage_limit ?? null
    }
  )
  return get('SELECT * FROM promotions WHERE id = :id', { id })
}

export const updatePromotion = (id, input) => {
  run(
    `UPDATE promotions SET
      code = :code,
      name = :name,
      description = :description,
      discount_type = :discount_type,
      discount_value = :discount_value,
      starts_at = :starts_at,
      ends_at = :ends_at,
      usage_limit = :usage_limit
    WHERE id = :id`,
    {
      id,
      code: input.code.toUpperCase(),
      name: input.name,
      description: input.description || null,
      discount_type: input.discount_type,
      discount_value: input.discount_value,
      starts_at: input.starts_at || null,
      ends_at: input.ends_at || null,
      usage_limit: input.usage_limit ?? null
    }
  )
  return get('SELECT * FROM promotions WHERE id = :id', { id })
}

export const deletePromotion = (id) => {
  run('DELETE FROM promotions WHERE id = :id', { id })
}

export const incrementPromotionUsage = (code) => {
  run(
    `UPDATE promotions SET usage_count = usage_count + 1
     WHERE code = :code`,
    { code }
  )
}
