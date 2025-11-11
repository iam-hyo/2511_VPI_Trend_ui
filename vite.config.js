import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 백엔드 서버(localhost:3000)로 전달
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})