import { useEffect } from 'react'
import { Grid, Row, Col, Pagination } from 'antd'
import { mockProducts } from '@/mock/productMock'
import { useProductStore } from '@/store/useProductStore'
import ProductCard from '@/components/common/ProductCard'
import FilterPanel from '@/components/common/FilterPanel'
/* Header module not found; provide a local fallback Header component */
function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 text-lg font-semibold">商品商城</div>
    </header>
  )
}

export default function ProductListPage() {
  const { setProducts, paginatedProducts, totalPages, currentPage, setCurrentPage } = useProductStore()
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()

  useEffect(() => {
    setProducts(mockProducts)
  }, [setProducts])

  const products = paginatedProducts()
  const colSpan = screens.md ? 6 : screens.sm ? 8 : 12

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 将标题居中 */}
        <h1 className="text-2xl font-bold mb-4 text-center">商品列表</h1>

        <FilterPanel />

        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">暂无商品</div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {products.map(product => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            <div className="mt-8 flex justify-center">
              <Pagination
                current={currentPage}
                total={totalPages() * 12} // total 为总条数，非页数
                pageSize={12}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}