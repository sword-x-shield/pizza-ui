import { defineConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue'
import genExampleEntry from '@pizza/site-parser'

const genEntry = genExampleEntry();
const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/]
})
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    genEntry,
    vuePlugin,
  ]
})
