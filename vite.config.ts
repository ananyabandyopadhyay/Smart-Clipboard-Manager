import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: '/E:/personal-project/vite/main.tsx',
      output: {
        entryFileNames: 'app.tsx',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    include: ['**/*.test.tsx'],
  },
});
