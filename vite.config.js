import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: mode === 'clip' ? 'dist-clip' : 'dist',
    rollupOptions: {
      input: mode === 'clip'
        ? 'index-clip.html'  // your clip HTML
        : 'index.html',      // full app HTML
    },
  },
  optimizeDeps: {
    entries: mode === 'clip' ? ['index-clip.html'] : ['index.html'],
  },
}))


