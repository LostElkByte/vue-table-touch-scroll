import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    disabled: true,
  },
  test: {
    name: 'unit',
    globals: true,
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      exclude: [
        'play/**',
        'docs/**',
        'internal/**',
        'scripts/**',
        '**/*.d.ts',
        '**/node_modules/**',
      ],
    },
  },
})
