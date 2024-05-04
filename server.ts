import { readFile } from 'node:fs/promises';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

const isProd = process.env['NODE_ENV'] === 'production';
let html = await readFile(isProd ? 'build/index.html' : 'index.html', 'utf8');

if (!isProd) {
  // Inject Vite client code to the HTML
  html = html.replace(
    '<head>',
    `
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

const app = new Hono()
  .use('/assets/*', serveStatic({ root: isProd ? 'build/' : './' })) // path must end with '/'
  .get('/*', (c) => c.html(html));

app.use('*', async (c, next) => {
  await next();
  c.res.headers.append('X-Powered-By', 'Hono');
});

export default app;

if (isProd) {
  serve({ ...app, port: 4321 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}
