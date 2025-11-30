import React from 'react'
import { Radio } from 'antd'

type SpecSelectorProps = {
  // 整个规格对象：key -> 值数组
  specs?: Record<string, any>
  // 当前已选的规格
  selectedSpecs?: Record<string, string>
  // 回调：传入 (key, value)
  onChange?: (key: string, value: string) => void
}

export default function SpecSelector({ specs = {}, selectedSpecs = {}, onChange }: SpecSelectorProps) {
  // 防御性处理：确保 specs 是对象
  const entries = specs && typeof specs === 'object' ? Object.entries(specs) : []

  if (entries.length === 0) return null

  return (
    <div>
      {entries.map(([key, values]) => {
        // 确保 values 为数组
        const items = Array.isArray(values) ? values : values ? [values] : []
        const current = selectedSpecs[key]

        if (items.length === 0) return null

        return (
          <div key={key} className="mb-4">
            <div className="text-sm mb-2 font-medium">{key}</div>
            <Radio.Group
              value={current}
              onChange={e => onChange && onChange(key, e.target.value)}
            >
              {items.map((v: any) => (
                <Radio.Button key={String(v)} value={String(v)} className="mr-2 mb-2">
                  {String(v)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        )
      })}
    </div>
  )
}