# 使用说明

## 创建新插件

1. 复制 `src/metools-app-example.vue` 并重命名为符合规范的名称：
   ```bash
   cp src/metools-app-example.vue src/metools-app-yourplugin.vue
   ```

2. 修改新插件的代码以实现所需功能

3. 更新 `src/index.ts` 中的导出信息：
   ```typescript
   export const info = {
       version: "1.0.0", // 版本号
       name: "你的插件名称", // 中文名称
       enName: "YourPlugin", // 英文名称
       description: "你的插件描述", // 描述，不少于10个字符
       author: "Your Name", // 作者
       icon: icon, // 插件图标
   }

   // 导出 Vue3 组件
   export { default as default } from './metools-app-yourplugin.vue'
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