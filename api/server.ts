import { Hono, type Env } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { BlankSchema } from 'hono/types';

export const createServer = (): Hono<Env, BlankSchema> => {
  const app = new Hono();

  // Add the middleware before the HTTP requests.

  // Add logger.
  app.use(logger());

  // Add powered by header.
  app.use(async (c, next) => {
    await next();
    c.res.headers.append('X-Powered-By', 'Hono');
  });

  // Add pretty JSON.
  app.use(prettyJSON());

  return app;
};
