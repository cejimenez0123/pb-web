import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
    build: {
        outDir: 'public',
    },
    publicDir: 'assets',
 
  plugins: [react()],
  // define: {
  //   'process.env': {}
  // }
})
