import { readFileSync } from 'node:fs';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { z } from 'zod';

import '@/models/migration';

import { env, isProd } from '@/utils/env';

// Create Hono route.
const app = new Hono();

// Define your custom routes here.
// TODO

// Add powered by header.
app.use('*', async (c, next) => {
  await next();
  c.res.headers.append('X-Powered-By', 'Hono');
});

// Add the static resource here by using the generated _static_routes.json.
if (isProd()) {
  const staticRoutes = z.array(z.string()).parse(JSON.parse(readFileSync('build/_static_routes.json', 'utf8')));
  for (const staticRoute of staticRoutes) {
    app.use(staticRoute, serveStatic({ root: 'build/' }));
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
app.use('/assets/*', serveStatic({ root: isProd() ? 'build/' : './' })).get('/*', (c) => c.html(html));

// Start the serving in production.
if (isProd()) {
  serve({ ...app, port: env.PORT }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}

// This export is mainly used by the @hono/vite-dev-server.
export default app;
