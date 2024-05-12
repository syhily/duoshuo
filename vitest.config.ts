import { defineConfig, mergeConfig } from 'vitest/config';

import 'dotenv-flow/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {},
  }),
);
