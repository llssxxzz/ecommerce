import { create } from 'zustand'
import type{ Product } from '@/mock/productMock'

interface CartItem extends Product {
  selectedSpecs: Record<string, string>
  quantity: number
  unitPrice: number // 新增：记录加入时的单价
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product, selectedSpecs: Record<string, string>, quantity: number, unitPrice?: number) => void
  removeItem: (index: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, selectedSpecs, quantity, unitPrice) => {
    const price = typeof unitPrice === 'number' ? unitPrice : product.price
    set(state => {
      // 用 product.id + specs 区分唯一项
      const key = (p: CartItem) => `${p.id}-${JSON.stringify(p.selectedSpecs)}`
      const existingIndex = state.items.findIndex(i => key(i) === `${product.id}-${JSON.stringify(selectedSpecs)}`)
      if (existingIndex >= 0) {
        const items = [...state.items]
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: items[existingIndex].quantity + quantity
        }
        return { items }
      }
      const newItem: CartItem = {
        ...product,
        selectedSpecs,
        quantity,
        unitPrice: price
      }
      return { items: [...state.items, newItem] }
    })
  },
  removeItem: index => set(state => ({ items: state.items.filter((_, i) => i !== index) })),
  clear: () => set({ items: [] })
}))