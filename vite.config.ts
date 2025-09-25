import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import packageJson from './package.json'

// 在 ES 模块中模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ command }) => {
    const isProduction = command === 'build'
    
    return {
        root: isProduction ? '.' : './playground',
        plugins: [
            vue(),
            AutoImport({
                imports: ['vue'],
                resolvers: [NaiveUiResolver()],
                dts: './src/auto-imports.d.ts',
            }),
            Components({
                resolvers: [NaiveUiResolver()],
                dts: './src/components.d.ts',
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src')
            }
        },
        assetsInclude: ['**/*.svg'],
        // 定义全局变量，解决浏览器环境中process未定义的问题
        define: {
            'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
            'process': 'undefined'
        },
        build: {
            outDir: 'dist',
            lib: {
                entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
                name: packageJson.name,
                formats: ['es'],
                fileName: 'index'
            },
            rollupOptions: {
                // 不设置external，将所有依赖内联打包
                external: [],
                output: {
                    // 禁用代码分割，将所有代码打包到单个文件
                    manualChunks: undefined,
                    inlineDynamicImports: true,
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css')) {
                            return 'index.css'
                        }
                        return assetInfo.name || 'assets/[name].[ext]'
                    }
                }
            },
            assetsInlineLimit: 0, // 禁用内联，所有资源都作为文件输出
            // 生成类型定义文件
            emptyOutDir: true
        }
    }
})