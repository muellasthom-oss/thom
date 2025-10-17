import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const findIndex = (items, productId, variationId) =>
  items.findIndex((item) => item.product.id === productId && item.variation?.id === variationId)

const useCartStore = create(persist((set, get) => ({
  items: [],
  affiliateCode: null,
  promoCode: null,
  addItem: (product, variation, quantity = 1) => {
    const items = [...get().items]
    const index = findIndex(items, product.id, variation?.id || null)
    if (index >= 0) {
      items[index] = {
        ...items[index],
        quantity: items[index].quantity + quantity
      }
    } else {
      items.push({ product, variation, quantity })
    }
    set({ items })
  },
  removeItem: (productId, variationId = null) => {
    set({ items: get().items.filter((item) => !(item.product.id === productId && (item.variation?.id || null) === variationId)) })
  },
  updateQuantity: (productId, variationId, quantity) => {
    const items = [...get().items]
    const index = findIndex(items, productId, variationId)
    if (index >= 0) {
      items[index] = { ...items[index], quantity }
      set({ items })
    }
  },
  clear: () => set({ items: [], affiliateCode: null, promoCode: null }),
  setAffiliateCode: (code) => set({ affiliateCode: code }),
  setPromoCode: (code) => set({ promoCode: code }),
  subtotal: () => get().items.reduce((sum, item) => {
    const base = item.product.price_cents
    const modifier = item.variation ? item.variation.price_modifier_cents || 0 : 0
    return sum + (base + modifier) * item.quantity
  }, 0)
}), {
  name: 'howstore-cart'
}))

export default useCartStore
