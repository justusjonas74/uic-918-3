import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'build/**/*', '.direnv/**/*'],
    // include: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    coverage: {
      provider: 'v8',
      exclude: [...coverageConfigDefaults.exclude, 'build/**/*', '.direnv/**/*']
    }
  }
});
