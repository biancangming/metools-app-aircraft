import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    fromVite: true,
    dts: {
      vue: true,
    },
    minify: true,
    outputOptions: {
      // exports: 'named',
      assetFileNames: 'index.css',
      minify: {
        mangle: true,
        compress: true,
        removeWhitespace: true,
      },
    },
  },
])