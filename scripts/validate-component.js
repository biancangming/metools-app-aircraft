#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 检查 index.ts 导出是否完整
function validateExport() {
  const indexPath = path.join(__dirname, '../src/index.ts')
  
  try {
    const content = fs.readFileSync(indexPath, 'utf-8')
    
    const requiredExports = [
      'export const info',
      'export default'
    ]
    
    for (const exportItem of requiredExports) {
      if (!content.includes(exportItem)) {
        console.error(`错误: index.ts 中缺少必要的导出: ${exportItem}`)
        process.exit(1)
      }
    }
    
    console.log('导出信息验证通过')
    return true
  } catch (error) {
    console.error('错误: 无法读取 index.ts 文件')
    console.error(error.message)
    process.exit(1)
  }
}

// 执行验证
try {
  validateExport()
  console.log('所有验证通过！组件符合打包要求。')
} catch (error) {
  console.error('验证失败:', error.message)
  process.exit(1)
}