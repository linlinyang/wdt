import {
  configDefaults,
  defineConfig,
} from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'v8'
    },
    workspace: [{
      plugins: [vue()],
      test: {
        environment: 'jsdom',
        include: ['**/__tests__/**/*.ts'],
        exclude: [...configDefaults.exclude, '**/__tests__/**/*.ui.ts'],
        globals: true,
        name: 'ts-test',
      },
    }, {
      plugins: [vue()],
      test: {
        environment: 'jsdom',
        include: ['**/__tests__/**/*.ui.ts'],
        setupFiles: ['./vitest.setup.ts'],
        exclude: [...configDefaults.exclude],
        globals: true,
        name: 'ui-test',
        browser: {
          enabled: true,
          provider: 'playwright',
          viewport: {
            width: 500,
            height: 800,
          },
          instances: [{
            browser: 'chromium',
          }],
        },
      },
    }],
  },
});
