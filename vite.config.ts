import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// 在 ES 模块中模拟 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
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
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process': 'undefined'
    },
    // 设置相对路径
    base: './',
    build: {
        outDir: 'dist',
        // 移除库模式配置，使用标准应用模式
        rollupOptions: {
            output: {
                // 设置资源文件名格式
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'assets/[name].[hash].[ext]'
                    }
                    return 'assets/[name].[hash].[ext]'
                },
                chunkFileNames: 'assets/[name].[hash].js',
                entryFileNames: 'assets/[name].[hash].js'
            }
        },
        assetsInlineLimit: 4096, // 小于4kb的资源内联
        emptyOutDir: true
    }
})