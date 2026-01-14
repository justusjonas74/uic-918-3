import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
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
