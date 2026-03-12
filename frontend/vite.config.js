import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server : {
    proxy : {
      '/user/api' : 'http://localhost:3000',
      '/blog/api' : 'http://localhost:3000',
      '/comment/api' : 'http://localhost:3000',
      '/blog/api/search' : 'http://localhost:3000',
      '/chat/api' : 'http://localhost:3000',
      '/blog/api/:id/like' : 'http://localhost:3000',
      '/user/api/managelike' : 'http://localhost:3000'
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})


