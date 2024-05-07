import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import devServer, { defaultOptions } from '@hono/vite-dev-server';
import react from '@vitejs/plugin-react-swc';
import { type Plugin, type ResolvedConfig, type UserConfig, defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// If you add new static resources, you may need to restart the vite for now.
const staticRoutes = (publicDir: string): string[] =>
  readdirSync(publicDir, { withFileTypes: true }).map((e) => (e.isDirectory() ? `/${e.name}/*` : `/${e.name}`));

const generateStaticRoutes = (): Plugin => {
  let config: ResolvedConfig;

  return {
    name: 'generate-static-routes:build',
    apply: 'build',
    configResolved: (resolvedConfig) => {
      config = resolvedConfig;
    },
    writeBundle: () => {
      writeFileSync(
        resolve(config.build.outDir, '_static_routes.json'),
        JSON.stringify(staticRoutes(config.publicDir)),
      );
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4321,
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    react(),
    tsconfigPaths(),
    devServer({
      entry: 'server.ts',
      exclude: [...defaultOptions.exclude, ...staticRoutes('public')],
      injectClientScript: false,
    }),
    generateStaticRoutes(),
  ],
}) satisfies UserConfig;
