![Github Poster](design/duoshuo-github-poster.png#gh-light-mode-only)
![Github Poster](design/duoshuo-github-poster-dark.png#gh-dark-mode-only)

A self-host comment system which in favor of my favourite died social comment
solution [多说](https://github.com/duoshuo).

This is a hobby project which I just want to test the ability of developing full-stack application all in JS.
All the technology stacks that I choose to use is the newest one I think.
So I don't promise any stability and backward compatible.
It's not a production ready project, I don't recommend using it in any projects.

## Tech Stack

Almost all the application codes are written in TypeScript.
I love typed with zod which can pre-check everything before the execution.

1. Hono.js: https://hono.dev
2. Zod: https://zod.dev
3. Vite.js: https://vitejs.dev
4. React: https://react.dev
5. Tailwind: https://tailwindcss.com
6. shadcn/ui: https://ui.shadcn.com
7. Drizzle ORM: https://orm.drizzle.team
8. MySQL (Cloud SaaS): https://zeabur.com/docs/marketplace/mysql

## Project Structure

### Common

- `api` The folder that stores our API gateway applications, A.K.A. route handlers or controllers which are written in
  TS.
- `utils` The folder that stores utility functions.

### Frontend

- `build` The folder that stores frontend build files, our bundled HTML, JS, CSS files will be stored here.
- `components` The folder that stores reusable frontend React components.
- `public` The folder that stores static and public resources.
- `views` The folder that stores UI views, A.K.A. web pages written in TSX.
- `client.tsx` The entry file of frontend.
- `index.html` The web page that hosts the web app.

### Backend

- `dist` The folder that stores backend compiled JS files.
- `models` The folder that stores model or schema files.
- `services` This folder is not mandatory, but many people like to abstract business logic into services.
- `server.ts` The entry file of backend.

## Development and Deployment

### Structure

This project separates into two parts, the frontend and the backend.
The frontend is a React project in CSR mode.
I don't like SSR, and the existing SSR solutions such as Next.js, Remix, Waku are hard to use and complex.

The backend is an API server built on top of the Hono.js.
Which means this application can be easily deployed to any edge runtimes or serverless solutions.
But for now, it targets to zeabur which has the MySQL runtime internally.

When you want to develop the project.
Execute the command `npm run dev`, the backend and frontend are serving under the same port `4321` with HMR support.

When you want to build the project, execute the command `npm run build`.
The frontend files will be built by using Vite and located under the `build` directory, they are static.
While the backend files are located in the `dist` directory, they are dynamic with the dot env files.

After building the project, you can execute `npm prune --production` to remove all the dev dependencies.
The application can be executed by using `npm start`.

### Configuration

Almost all the configurations can be configured after the application started except the port and the database.
It's configured through the environment variables and `.env` files.
Copy the default `.env.example` file,
rename it to `.env.local` and `.env.production.local` which will be ignored by the git.
Change the content as your needs.
The `.env.local` is used for local development while `.env.production.local` is used for production.

## License

The source code of this blog is licensed under the [MIT](./LICENSE) license,
feel to free to use it without any legal risks.

The font used in logo is Super Peach Font,
it's free for personal use and commercial use, but I couldn't find the license file.
