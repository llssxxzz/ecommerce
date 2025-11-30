import Mock from 'mockjs'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  sales: number
  category: 'electronics' | 'clothing' | 'books' | 'home'
  description: string
  images: string[]
  specs: {
    color: string[]
    size?: string[]
    memory?: string[]
  }
  stock: number
  rating: number
}

export const categories = ['electronics', 'clothing', 'books', 'home']
const colors = ['Red', 'Blue', 'Black', 'White', 'Green']
const sizes = ['S', 'M', 'L', 'XL']

export const mockProducts: Product[] = Mock.mock({
  'list|50': [{
    'id|+1': 1,
    name: '@ctitle(4, 8)',
    price: '@float(20, 500, 0, 2)',
    originalPrice: '@float(50, 800, 0, 2)',
    sales: '@integer(100, 5000)',
    category: () => Mock.Random.pick(categories),
    description: '@cparagraph(1, 2)',
    'images|3-5': ['@image(300x300, @color, @title)'],
    specs() {
      const cat = typeof this.category === 'function' ? this.category() : this.category
      if (cat === 'electronics') {
        const n = Mock.Random.integer(2, 4)
        return {
          // 确保返回数组
          color: Array.from({ length: n }, () => Mock.Random.pick(colors)),
          memory: ['64GB', '128GB', '256GB']
        }
      } else if (cat === 'clothing') {
        const n = Mock.Random.integer(2, 4)
        return {
          color: Array.from({ length: n }, () => Mock.Random.pick(colors)),
          size: sizes
        }
      } else {
        return { color: ['N/A'] }
      }
    },
    stock: '@integer(0, 200)',
    rating: '@float(3.5, 5, 1, 1)'
  }]
}).list.map((p: any) => ({
  ...p,
  id: `P${p.id.toString().padStart(4, '0')}`
}))