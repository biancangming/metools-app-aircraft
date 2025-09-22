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

export default defineConfig({
    root: './playground',
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
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: packageJson.name,
            formats: ['es'],
            cssFileName: "index"
        }
    }
})