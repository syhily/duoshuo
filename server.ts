import { readFileSync } from 'fs';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { z } from 'zod';

const isProd = process.env['NODE_ENV'] === 'production';
let html = readFileSync(isProd ? 'build/index.html' : 'index.html', 'utf8');

if (!isProd) {
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

const app = new Hono().use('/assets/*', serveStatic({ root: isProd ? 'build/' : './' }));

app.use('*', async (c, next) => {
  await next();
  c.res.headers.append('X-Powered-By', 'Hono');
});

// Add the static resource here by using the generated _static_routes.json.
if (isProd) {
  const staticRoutes = z.array(z.string()).parse(JSON.parse(readFileSync('build/_static_routes.json', 'utf8')));
  for (let staticRoute of staticRoutes) {
    app.use(staticRoute, serveStatic({ root: 'build/' }));
  }
}

// Add the default endpoint for all the fallback.
app.get('/*', (c) => c.html(html));

// Start the serving in production.
if (isProd) {
  serve({ ...app, port: 4321 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}

// This export is mainly used by the @hono/vite-dev-server.
export default app;
