import { create } from 'zustand'
import type{ Product } from '@/mock/productMock'

type SortType = 'price-asc' | 'price-desc' | 'sales-desc' | 'default'

interface ProductState {
  products: Product[]
  filteredProducts: Product[]
  
  // 筛选 & 排序状态
  filters: {
    category: string | null
    minPrice: number | null
    maxPrice: number | null
    keyword: string
  }
  sort: SortType
  currentPage: number
  pageSize: number

  // Actions
  setProducts: (products: Product[]) => void
  setFilter: (key: keyof ProductState['filters'], value: any) => void
  setSort: (sort: SortType) => void
  setCurrentPage: (page: number) => void
  resetFilters: () => void

  // 衍生数据（计算属性）
  paginatedProducts: () => Product[]
  totalPages: () => number
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],

  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    keyword: ''
  },
  sort: 'default',
  currentPage: 1,
  pageSize: 12,

  setProducts: (products) => {
    set({ products, filteredProducts: products })
  },

  setFilter: (key, value) => {
    set((state) => {
      const newFilters = { ...state.filters, [key]: value }
      const filtered = filterProducts(state.products, newFilters)
      const sorted = sortProducts(filtered, state.sort)
      return {
        filters: newFilters,
        filteredProducts: sorted,
        currentPage: 1 // 重置页码
      }
    })
  },

  setSort: (sort) => {
    set((state) => {
      const sorted = sortProducts(state.filteredProducts, sort)
      return { sort, filteredProducts: sorted }
    })
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () => {
    set((state) => ({
      filters: { category: null, minPrice: null, maxPrice: null, keyword: '' },
      sort: 'default',
      filteredProducts: state.products,
      currentPage: 1
    }))
  },

  paginatedProducts: () => {
    const { filteredProducts, currentPage, pageSize } = get()
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  },

  totalPages: () => {
    const { filteredProducts, pageSize } = get()
    return Math.ceil(filteredProducts.length / pageSize)
  }
}))

// 工具函数
const filterProducts = (products: Product[], filters: ProductState['filters']) => {
  return products.filter(p => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.minPrice && p.price < filters.minPrice) return false
    if (filters.maxPrice && p.price > filters.maxPrice) return false
    if (filters.keyword && !p.name.toLowerCase().includes(filters.keyword.toLowerCase())) return false
    return true
  })
}

const sortProducts = (products: Product[], sort: SortType) => {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'sales-desc':
      return sorted.sort((a, b) => b.sales - a.sales)
    default:
      return sorted
  }
}