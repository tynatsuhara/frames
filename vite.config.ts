import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  // the project is deployed at ty.pizza/frames, so we need to configure the base path
  base: process.env.NODE_ENV === 'production' ? 'frames/' : '/',
})
