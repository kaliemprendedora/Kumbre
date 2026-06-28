import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['engine/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['engine/**/*.ts'],
      exclude: ['engine/__tests__/**', 'engine/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})
