# Duoshuo

A self-host comment system which in favor of my favourite died social comment solution [多说](https://github.com/duoshuo).
This is a hobby project which I just want to test the ability of developing full-stack application in JS.
All the technology stack I choose is the newest one I think.
So I don't promise any stability and backward compatible.
It's not a production ready project, I don't recommend using it in any projects.

## Tech Stack

1. Hono.js: https://hono.dev
2. Vite.js: https://vitejs.dev
3. React: https://react.dev
4. Tailwind: https://tailwindcss.com
5. shadcn/ui: https://ui.shadcn.com
6. Drizzle ORM: https://orm.drizzle.team
7. MySQL (Cloud SaaS): https://zeabur.com/docs/marketplace/mysql

## Project Structure

- `api` The folder that stores our API gateway applications, A.K.A. route handlers or controllers which are written in TS.
- `build` The folder that stores frontend build files, our bundled HTML, JS, CSS files will be stored here.
- `components` The folder that stores reusable frontend React components.
- `dist` The folder that stores backend compiled JS files.
- `models` The folder that stores model or schema files.
- `public` The folder that stores static and public resources.
- `services` This folder is not mandatory, but many people like to abstract business logic into services.
- `utils` The folder that stores utility functions.
  - `common.ts` Utility functions for both backend and frontend.
  - `backend.ts` Utility functions for backend specifically.
  - `frontend.tsx` Utility functions for frontend specifically.
- `views` The folder that stores UI views, A.K.A. web pages written in TSX.
- `server.ts` The entry file of backend.
- `client.tsx` The entry file of frontend.
- `index.html` The web page that hosts the web app.
