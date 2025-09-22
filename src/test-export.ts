// 测试文件，用于验证组件导出是否正确
import { info, default as Component } from './index'

console.log('Component Info:', info)
console.log('Component:', Component)

export { info, Component }