
## 全局约定

1. playground 文件夹是预览文件夹，不做任何修改
2. src 文件夹是项目代码文件夹，所有代码都在这个文件夹下

## 插件命名规范

1. 复制 `src/metools-app-example.vue` 并重命名为符合规范的名称：
   ```bash
   cp src/metools-app-example.vue src/metools-app-yourplugin.vue
   ```

2. 修改新插件的代码以实现所需功能

3. 更新 `src/index.ts` 中的导出信息：
   ```typescript
   import icon from './icon'
   import app from './app.vue'
   import pkg from '../package.json'

   const info = {
       version: pkg.version, // 版本号，引入package.json的version
       name: '你的插件名称', // 中文名称，必须修改
       enName: pkg.name, // 英文名称，必须修改
       description: pkg.description, // 描述，不少于10个字符。打包时引入package.json的description
       author: pkg.author, // 作者，引入package.json的author
       icon: icon, // 应用图标，必须存在
   }

   // 导出 Vue3 组件
   export default {
       entry: app,
       ...info,
   }
   ```

## 开发调试

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 在浏览器中打开 http://localhost:5173 查看效果

## 构建打包

1. 验证插件是否符合规范：
   ```bash
   npm run validate
   ```

2. 构建项目：
   ```bash
   npm run build
   ```

3. 构建后的文件将位于 `dist/` 目录中，可直接用于 metools 平台

## 注意事项

1. 插件文件名必须以 `metools-app-` 开头
2. 插件信息必须完整填写
3. 确保导出格式正确
4. 插件需要遵循 metools 平台的设计规范和交互要求