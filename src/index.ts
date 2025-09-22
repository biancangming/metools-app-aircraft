import icon from './icon'
import app from './app.vue'

export const info = {
    version: "1.0.0", // 版本号，引入package.json的version
    name: "示例应用", // 中文必须修改
    enName: "ExampleApp", // 英文名必须修改
    description: "metools示例应用组件", // 描述，不小于10个字符。打包时引入package.json的description
    author: "Jiawei", // 作者，引入package.json的author
    icon: icon, // 应用图标，必须存在
}

// 导出 Vue3 组件
export default app