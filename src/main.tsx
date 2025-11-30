import Mock from 'mockjs'
import { categories } from './mock/productMock'
Mock.Random.category = () => Mock.Random.pick(categories)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
