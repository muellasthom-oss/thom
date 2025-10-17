import slugify from 'slugify'
import { v4 as uuid } from 'uuid'
import { all, get, run, transaction } from '../utils/db-helpers.js'

const mapProduct = (row) => ({
  ...row,
  is_active: Boolean(row.is_active),
  metadata: row.metadata ? JSON.parse(row.metadata) : {},
  variations: []
})

const attachVariations = (product) => {
  const variations = all(
    `SELECT id, name, price_modifier_cents, stock, metadata
     FROM product_variations WHERE product_id = :product_id`,
    { product_id: product.id }
  ).map((v) => ({
    ...v,
    metadata: v.metadata ? JSON.parse(v.metadata) : {}
  }))
  return { ...product, variations }
}

export const listProducts = ({ activeOnly = false } = {}) => {
  const rows = all(
    `SELECT * FROM products
     ${activeOnly ? 'WHERE is_active = 1' : ''}
     ORDER BY created_at DESC`
  ).map(mapProduct)
  return rows.map(attachVariations)
}

export const getProductBySlug = (slug) => {
  const row = get('SELECT * FROM products WHERE slug = :slug', { slug })
  if (!row) return null
  return attachVariations(mapProduct(row))
}

export const getProductById = (id) => {
  const row = get('SELECT * FROM products WHERE id = :id', { id })
  if (!row) return null
  return attachVariations(mapProduct(row))
}

export const createProduct = (input) => {
  const id = uuid()
  const slug = input.slug || slugify(input.name, { lower: true, strict: true })
  const now = new Date().toISOString()
  transaction(() => {
    run(
      `INSERT INTO products (
        id, slug, name, summary, description, price_cents, currency, image_url, banner_url,
        digital_content, stock, metadata, is_active, created_at, updated_at
      ) VALUES (
        :id, :slug, :name, :summary, :description, :price_cents, :currency, :image_url, :banner_url,
        :digital_content, :stock, :metadata, :is_active, :created_at, :updated_at
      )`,
      {
        id,
        slug,
        name: input.name,
        summary: input.summary || null,
        description: input.description || null,
        price_cents: input.price_cents,
        currency: input.currency || 'BRL',
        image_url: input.image_url || null,
        banner_url: input.banner_url || null,
        digital_content: input.digital_content || null,
        stock: input.stock ?? null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        is_active: input.is_active ? 1 : 0,
        created_at: now,
        updated_at: now
      }
    )

    if (Array.isArray(input.variations)) {
      input.variations.forEach((variation) => {
        run(
          `INSERT INTO product_variations (id, product_id, name, price_modifier_cents, stock, metadata)
           VALUES (:id, :product_id, :name, :price_modifier_cents, :stock, :metadata)`,
          {
            id: uuid(),
            product_id: id,
            name: variation.name,
            price_modifier_cents: variation.price_modifier_cents || 0,
            stock: variation.stock ?? null,
            metadata: variation.metadata ? JSON.stringify(variation.metadata) : null
          }
        )
      })
    }
  })()

  return getProductById(id)
}

export const updateProduct = (id, input) => {
  const existing = get('SELECT * FROM products WHERE id = :id', { id })
  if (!existing) throw new Error('Product not found')
  const now = new Date().toISOString()
  transaction(() => {
    run(
      `UPDATE products SET
        slug = :slug,
        name = :name,
        summary = :summary,
        description = :description,
        price_cents = :price_cents,
        currency = :currency,
        image_url = :image_url,
        banner_url = :banner_url,
        digital_content = :digital_content,
        stock = :stock,
        metadata = :metadata,
        is_active = :is_active,
        updated_at = :updated_at
      WHERE id = :id`,
      {
        id,
        slug: input.slug || existing.slug,
        name: input.name || existing.name,
        summary: input.summary ?? existing.summary,
        description: input.description ?? existing.description,
        price_cents: input.price_cents ?? existing.price_cents,
        currency: input.currency || existing.currency,
        image_url: input.image_url ?? existing.image_url,
        banner_url: input.banner_url ?? existing.banner_url,
        digital_content: input.digital_content ?? existing.digital_content,
        stock: input.stock ?? existing.stock,
        metadata: input.metadata ? JSON.stringify(input.metadata) : existing.metadata,
        is_active: input.is_active != null ? (input.is_active ? 1 : 0) : existing.is_active,
        updated_at: now
      }
    )

    if (Array.isArray(input.variations)) {
      run('DELETE FROM product_variations WHERE product_id = :product_id', { product_id: id })
      input.variations.forEach((variation) => {
        run(
          `INSERT INTO product_variations (id, product_id, name, price_modifier_cents, stock, metadata)
           VALUES (:id, :product_id, :name, :price_modifier_cents, :stock, :metadata)`,
          {
            id: variation.id || uuid(),
            product_id: id,
            name: variation.name,
            price_modifier_cents: variation.price_modifier_cents || 0,
            stock: variation.stock ?? null,
            metadata: variation.metadata ? JSON.stringify(variation.metadata) : null
          }
        )
      })
    }
  })()

  return getProductById(id)
}

export const deleteProduct = (id) => {
  run('DELETE FROM product_variations WHERE product_id = :id', { id })
  run('DELETE FROM products WHERE id = :id', { id })
}
