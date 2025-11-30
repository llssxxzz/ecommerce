import { Card, Tag, Rate, Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { Product } from '@/mock/productMock'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()

  const handleAddToCart = () => {
    message.success(`${product.name} 已加入购物车！`)
    // 实际应弹出规格选择 → 见下方 SpecSelector
  }

  return (
    <Card
      hoverable
      cover={
        <img 
          alt={product.name} 
          src={product.images[0]} 
          className="h-48 object-cover"
        />
      }
      className="shadow-sm hover:shadow-md transition-shadow"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <Card.Meta
        title={<div className="font-medium">{product.name}</div>}
        description={
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-red-600">¥{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Rate disabled value={product.rating} />
              <span className="text-xs text-gray-500">({product.sales}人已购)</span>
            </div>
            <Tag color={product.category === 'electronics' ? 'blue' : 
                        product.category === 'clothing' ? 'green' : 
                        product.category === 'books' ? 'purple' : 'gold'}>
              {product.category}
            </Tag>
          </div>
        }
      />
      <div className="mt-3 flex justify-between">
        <Button size="small" type="primary" onClick={(e) => {
          e.stopPropagation()
          handleAddToCart()
        }}>
          <ShoppingCartOutlined /> 加购
        </Button>
      </div>
    </Card>
  )
}