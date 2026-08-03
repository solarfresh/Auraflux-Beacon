import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    host: '127.0.0.1',
    hmr: false
  },
  resolve: {
    alias: {
      '@/tests': fileURLToPath(new URL('./tests', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),

    testTimeout: 120000,
    hookTimeout: 120000,
    teardownTimeout: 120000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{vue,ts}'],
      exclude: [
        'src/main.ts',
        'src/env.d.ts',
        '**/*.d.ts',
        '**/*.spec.ts'
      ]
    }
  }
})
