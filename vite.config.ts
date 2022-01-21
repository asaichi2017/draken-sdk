import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3200,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/sdk.ts'),
      name: 'draken',
      fileName: format => `draken-sdk.${format}.js`,
    },
    rollupOptions: {
      external: ['axios'],
      output: {
        assetFileNames: info => {
          if (info.name === 'style.css') {
            return 'draken-sdk.css'
          } else {
            return info.name
          }
        },
      },
    },
  },
})
