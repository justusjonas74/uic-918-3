import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [
    wasm(),
  ],
  test: {
    exclude: [...configDefaults.exclude, 'build/**/*'],
    // include: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    coverage: {
      provider: 'v8',
      exclude: [...coverageConfigDefaults.exclude, 'build/**/*']
    }
  }
});
