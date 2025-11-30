import { Input, Select, Slider, Button, Space } from 'antd'
import { SearchOutlined, FilterOutlined, SyncOutlined } from '@ant-design/icons'
import { useProductStore } from '@/store/useProductStore'

const categories = [
  { value: 'electronics', label: '数码电子' },
  { value: 'clothing', label: '服装服饰' },
  { value: 'books', label: '图书音像' },
  { value: 'home', label: '家居生活' }
]

export default function FilterPanel() {
  const { filters, setFilter, resetFilters, sort, setSort } = useProductStore()

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 分类 */}
        <Select
          placeholder="全部分类"
          value={filters.category}
          onChange={val => setFilter('category', val)}
          allowClear
          options={categories}
          style={{ width: '100%' }}
        />

        {/* 价格区间 */}
        <div>
          <div className="text-sm mb-1">价格区间</div>
          <Slider
            range
            min={0}
            max={1000}
            value={[filters.minPrice || 0, filters.maxPrice || 1000]}
            onChange={([min, max]) => {
              setFilter('minPrice', min === 0 ? null : min)
              setFilter('maxPrice', max === 1000 ? null : max)
            }}
            tooltip={{ formatter: (val) => `¥${val}` }}
          />
        </div>

        {/* 关键词搜索 */}
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索商品名"
          value={filters.keyword}
          onChange={e => setFilter('keyword', e.target.value)}
          allowClear
        />

        {/* 排序 */}
        <Select
          value={sort}
          onChange={setSort}
          options={[
            { value: 'default', label: '默认排序' },
            { value: 'price-asc', label: '价格↑' },
            { value: 'price-desc', label: '价格↓' },
            { value: 'sales-desc', label: '销量最高' }
          ]}
          style={{ width: '100%' }}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Space>
          <Button icon={<SyncOutlined />} onClick={resetFilters}>
            重置
          </Button>
        </Space>
      </div>
    </div>
  )
}