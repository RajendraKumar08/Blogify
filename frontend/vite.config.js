import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API = env.VITE_BACKEND_URL

  return defineConfig({
    // server: {
    //   proxy: {
    //     '/user/api': API,
    //     '/blog/api': API,
    //     '/comment/api': API,
    //     '/blog/api/search': API,
    //     '/chat/api': API,
    //     '/blog/api/:id/like': API,
    //     '/user/api/managelike': API,
    //     '/blog/api/:id/delete': API,
    //     '/blog/api/:id/view': API,
    //     '/user/api/:id': API,
    //     '/blog/api/:id/read-time': API,
    //   }
    // },
    plugins: [
      react(),
      tailwindcss(),
    ],
  })
}