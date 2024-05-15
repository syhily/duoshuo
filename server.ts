import { readFileSync } from 'node:fs';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { z } from 'zod';

import '@/models/migration';

import { createServer } from '@/api/server';
import { env, isProd } from '@/utils/env';

// Create Hono instance.
const server = createServer();

// Add the static resource here by using the generated _static_routes.json.
if (isProd()) {
  const staticRoutes = z.array(z.string()).parse(JSON.parse(readFileSync('build/_static_routes.json', 'utf8')));
  for (const staticRoute of staticRoutes) {
    server.use(staticRoute, serveStatic({ root: 'build/' }));
  }
}

// Load the frontend html.
let html = readFileSync(isProd() ? 'build/index.html' : 'index.html', 'utf8');

if (!isProd()) {
  // Inject Vite client code to the HTML.
  // We don't use the injectClientScript in @hono/vite-dev-server because it is buggy.
  html = html.replace(
    '<head>',
    `
  <head>
    <!-- This snippet is copied from https://vitejs.dev/guide/backend-integration.html -->
    <script type="module">
      import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>

    <script type="module" src="/@vite/client"></script>
    `,
  );
}

// Add the frontend endpoint for all the fallback.
server.use('/assets/*', serveStatic({ root: isProd() ? 'build/' : './' })).get('/*', (c) => c.html(html));

// Start the serving in production.
if (isProd()) {
  serve({ ...server, port: env.PORT }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}

// This export is mainly used by the @hono/vite-dev-server.
export default server;
