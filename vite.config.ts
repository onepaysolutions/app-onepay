import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    // 如果需要其他环境变量，可以在这里添加
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});