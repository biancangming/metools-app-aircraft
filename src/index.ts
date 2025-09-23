import icon from './icon'
import app from './app.vue'
import pkg from '../package.json'

export const info = {
    version: pkg.version, // 版本号，引入package.json的version
    name: '飞机大战', // 中文必须修改
    enName: pkg.name, // 英文名必须修改
    description: pkg.description, // 描述，不小于10个字符。打包时引入package.json的description
    author: pkg.author, // 作者，引入package.json的author
    icon: icon, // 应用图标，必须存在
}

// 导出 Vue3 组件
export default app