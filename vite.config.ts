import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/api/xras': {
        target: 'https://xras.ru',
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api\/xras/, ''), 
        secure: true, 
      },
      '/api/weather': {
        target: 'https://api.openweathermap.org/data/2.5',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
        secure: false,
      },
      '/api/forecast': {
        target: 'https://api.openweathermap.org/data/2.5',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/forecast/, ''),
        secure: false,
      },
      '/api/geocoding': {
        target: 'http://api.openweathermap.org/geo/1.0', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/geocoding/, ''),
        secure: false, 
      },
      '/api/swpc': {
        target: 'https://services.swpc.noaa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/swpc/, ''),
        secure: true,
      },
    },
  }
})
