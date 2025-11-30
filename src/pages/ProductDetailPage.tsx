import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Rate, Tag, message, Modal } from 'antd'
import { ShoppingCartOutlined, LeftOutlined } from '@ant-design/icons'
import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from '@/store/useCartStore'
import SpecSelector from '@/components/product/SpecSelector'
function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 text-lg font-semibold">商城</div>
    </header>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { products } = useProductStore()
  const { addItem } = useCartStore()

  const product = products.find(p => p.id === id)

  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    if (product) {
      // 初始化规格（选第一个）
      const initSpecs: Record<string, string> = {}
      Object.entries(product.specs).forEach(([key, values]) => {
        initSpecs[key] = values[0]
      })
      setSelectedSpecs(initSpecs)
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        商品不存在
      </div>
    )
  }

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs(prev => ({ ...prev, [key]: value }))
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      message.error('库存不足')
      return
    }
    if (quantity <= 0) {
      message.warning('请至少选择 1 件')
      return
    }

    const finalUnitPrice = product.price // 若有规格/优惠，需要在这里计算最终单价
    addItem(product, selectedSpecs, quantity, finalUnitPrice)
    setIsModalVisible(false)
    message.success('已加入购物车！')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Button icon={<LeftOutlined />} onClick={() => navigate(-1)} className="mb-6">
          返回列表
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* 图片区 */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full max-w-md h-96 object-contain mx-auto"
            />
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-16 h-16 object-cover cursor-pointer border rounded"
                />
              ))}
            </div>
          </div>

          {/* 信息区 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-600">¥{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Rate disabled value={product.rating} />
              <span className="text-gray-600">{product.sales}人已购买</span>
            </div>

            <Tag color="green" className="mt-3">库存: {product.stock}件</Tag>

            <div className="mt-6">
              <SpecSelector
                specs={product.specs}
                selectedSpecs={selectedSpecs}
                onChange={handleSpecChange}
              />
            </div>

            <div className="mt-6 flex items-center gap-4">
              <label>数量：</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-1 border rounded"
              />
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => setIsModalVisible(true)}
                block
              >
                加入购物车
              </Button>
            </div>

            <div className="mt-6 text-gray-700">
              <h3 className="font-medium mb-2">商品详情</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 加入购物车确认弹窗 */}
      <Modal
        title="确认加入购物车"
        open={isModalVisible}
        onOk={handleAddToCart}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>商品：{product.name}</p>
        <p>规格：{Object.entries(selectedSpecs).map(([k, v]) => `${k}:${v}`).join(', ')}</p>
        <p>数量：{quantity}</p>
        <p className="font-bold">小计：¥{(product.price * quantity).toFixed(2)}</p>
      </Modal>
    </div>
  )
}