import { createHashRouter } from 'react-router-dom'
import ProductListPage from '@/pages/ProductListPage'
import ProductDetailPage from '@/pages/ProductDetailPage'

const router = createHashRouter([
  { path: '/', element: <ProductListPage /> },
  { path: '/product/:id', element: <ProductDetailPage /> }
])

export default router